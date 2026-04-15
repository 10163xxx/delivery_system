package review.app

import domain.shared.given

import cats.effect.IO
import domain.admin.*
import domain.auth.*
import domain.order.*
import domain.review.*
import domain.shared.*
import shared.app.*

private def findReviewOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.OrderNotFound)

private def findReviewAppeal(
      current: DeliveryAppState,
      appealId: ReviewAppealId,
  ): Either[ErrorMessage, ReviewAppeal] =
    current.reviewAppeals.find(_.id == appealId).toRight(ValidationMessages.AppealNotFound)

private def requirePendingAppeal(appeal: ReviewAppeal): Either[ErrorMessage, Unit] =
    Either.cond(appeal.status == AppealStatus.Pending, (), ValidationMessages.AppealAlreadyResolved)

private def hasPendingReviewAppeal(
      current: DeliveryAppState,
      orderId: OrderId,
      appellantRole: AppealRole,
  ): ApprovalFlag =
    current.reviewAppeals.exists(appeal =>
      appeal.orderId == orderId &&
        appeal.appellantRole == appellantRole &&
        appeal.status == AppealStatus.Pending
    )

private def sanitizeAppealReason(reason: ReasonText): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.AppealReasonRequired,
    )

private def sanitizeEligibilityReason(reason: ReasonText): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.EligibilityReviewReasonRequired,
    )

private def sanitizeResolutionNote(
      value: ResolutionText,
      missingError: ErrorMessage,
  ): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(value, DeliveryValidationDefaults.OrderReasonMaxLength, missingError)

private def buildReviewAppeal(
      order: OrderSummary,
      appellantRole: AppealRole,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): ReviewAppeal =
    ReviewAppeal(
      id = nextId(new DisplayText("apl")),
      orderId = order.id,
      customerId = order.customerId,
      customerName = order.customerName,
      storeId = order.storeId,
      riderId = order.riderId,
      appellantRole = appellantRole,
      reason = reason,
      status = AppealStatus.Pending,
      resolutionNote = None,
      submittedAt = timestamp,
      reviewedAt = None,
    )

private def reviewAppeal(
      appeal: ReviewAppeal,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): ReviewAppeal =
    appeal.copy(
      status = if approved then AppealStatus.Approved else AppealStatus.Rejected,
      resolutionNote = Some(resolutionNote),
      reviewedAt = Some(timestamp),
    )

private def hasPendingEligibilityReview(
      current: DeliveryAppState,
      request: EligibilityReviewRequest,
  ): ApprovalFlag =
    current.eligibilityReviews.exists(review =>
      review.target == request.target &&
        review.targetId == request.targetId &&
        review.status == AppealStatus.Pending
    )

private def buildEligibilityReview(
      request: EligibilityReviewRequest,
      targetName: DisplayText,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): EligibilityReview =
    EligibilityReview(
      id = nextId(new DisplayText("eqr")),
      target = request.target,
      targetId = request.targetId,
      targetName = targetName,
      reason = reason,
      status = AppealStatus.Pending,
      resolutionNote = None,
      submittedAt = timestamp,
      reviewedAt = None,
    )

private def reviewEligibility(
      review: EligibilityReview,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): EligibilityReview =
    review.copy(
      status = if approved then AppealStatus.Approved else AppealStatus.Rejected,
      resolutionNote = Some(resolutionNote),
      reviewedAt = Some(timestamp),
    )

private def hasResolvableAdminTicket(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, Unit] =
    current.tickets
      .find(ticket =>
        ticket.orderId == orderId &&
          ticket.status == TicketStatus.Open &&
          ticket.kind != TicketKind.DeliveryIssue,
      )
      .toRight(ValidationMessages.NoPendingTicket)
      .map(_ => ())

private def resolveAdminTickets(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionText: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open && ticket.kind != TicketKind.DeliveryIssue then
        ticket.copy(
          status = TicketStatus.Resolved,
          approved = None,
          resolutionNote = Some(resolutionText),
          reviewedAt = Some(timestamp),
          updatedAt = timestamp,
        )
      else ticket
    )

def submitReviewAppeal(
      orderId: OrderId,
      request: ReviewAppealRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          order <- findReviewOrder(current, orderId)
          _ <- Either.cond(order.reviewStatus == ReviewStatus.Active, (), ValidationMessages.ReviewRevokedCannotAppeal)
          _ <- validateAppealRole(order, request.appellantRole)
          _ <- Either.cond(!hasPendingReviewAppeal(current, orderId, request.appellantRole), (), ValidationMessages.PendingAppealExists)
          reason <- sanitizeAppealReason(request.reason)
        yield
          val timestamp = now()
          val appeal = buildReviewAppeal(order, request.appellantRole, reason, timestamp)
          withDerivedData(current.copy(reviewAppeals = appeal :: current.reviewAppeals))
      }
    }

def resolveReviewAppeal(
      appealId: ReviewAppealId,
      request: ResolveReviewAppealRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          appeal <- findReviewAppeal(current, appealId)
          _ <- requirePendingAppeal(appeal)
          order <- current.orders.find(_.id == appeal.orderId).toRight(ValidationMessages.RelatedOrderNotFound)
          resolutionNote <- sanitizeResolutionNote(request.resolutionNote, ValidationMessages.ResolutionNoteRequired)
        yield
          val timestamp = now()
          val reviewedAppeal = reviewAppeal(appeal, request.approved, resolutionNote, timestamp)
          val nextOrders =
            if request.approved then
              current.orders.map(entry =>
                if entry.id == order.id then revokeReview(entry, new ReasonText(resolutionNote.raw), timestamp) else entry
              )
            else current.orders
          val nextTickets =
            if request.approved then
              closeTicketsForOrder(
                current.tickets,
                order.id,
                renderReviewAppealResolvedNote(resolutionNote),
                timestamp,
              )
            else current.tickets
          withDerivedData(
            current.copy(
              orders = nextOrders,
              tickets = nextTickets,
              reviewAppeals = replaceAppeal(current.reviewAppeals, reviewedAppeal),
            )
          )
      }
    }

def submitEligibilityReview(
      request: EligibilityReviewRequest
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          targetName <- findEligibilityTargetName(current, request)
          _ <- validateEligibilityTargetState(current, request)
          _ <- Either.cond(!hasPendingEligibilityReview(current, request), (), ValidationMessages.PendingEligibilityReviewExists)
          reason <- sanitizeEligibilityReason(request.reason)
        yield
          val timestamp = now()
          val review = buildEligibilityReview(request, targetName, reason, timestamp)
          withDerivedData(current.copy(eligibilityReviews = review :: current.eligibilityReviews))
      }
    }

def resolveEligibilityReview(
      reviewId: EligibilityReviewId,
      request: ResolveEligibilityReviewRequest,
  ): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          review <- current.eligibilityReviews.find(_.id == reviewId).toRight(ValidationMessages.EligibilityReviewNotFound)
          _ <- Either.cond(review.status == AppealStatus.Pending, (), ValidationMessages.EligibilityReviewAlreadyResolved)
          resolutionNote <- sanitizeResolutionNote(request.resolutionNote, ValidationMessages.EligibilityReviewResolutionRequired)
        yield
          val timestamp = now()
          val reviewed = reviewEligibility(review, request.approved, resolutionNote, timestamp)
          withDerivedData(
            current.copy(eligibilityReviews = replaceEligibilityReview(current.eligibilityReviews, reviewed))
          )
      }
    }

def resolveTicket(orderId: OrderId, request: ResolveTicketRequest): IO[Either[ErrorMessage, DeliveryAppState]] =
    IO.blocking {
      updateState { current =>
        for
          _ <- hasResolvableAdminTicket(current, orderId)
          resolution <- sanitizeRequiredText(
            request.resolution,
            DeliveryValidationDefaults.TicketResolutionMaxLength,
            ValidationMessages.TicketResolutionRequired,
          )
          note <- sanitizeRequiredText(
            request.note,
            DeliveryValidationDefaults.OrderReasonMaxLength,
            ValidationMessages.ResolutionNoteRequired,
          )
        yield
          val timestamp = now()
          val resolutionText = renderAdminTicketResolution(resolution, note)
          withDerivedData(
            current.copy(tickets = resolveAdminTickets(current.tickets, orderId, resolutionText, timestamp))
          )
      }
    }
