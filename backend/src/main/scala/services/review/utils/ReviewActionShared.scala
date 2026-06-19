package services.review.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.objects.given
import services.review.objects.apiTypes.*
import system.app.objects.*

import services.admin.objects.*
import services.order.objects.*
import services.review.objects.*
import system.objects.*
import system.app.*

private[utils] def findReviewOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

private[utils] def findReviewAppeal(
      current: DeliveryAppState,
      appealId: ReviewAppealId,
  ): Either[ErrorMessage, ReviewAppeal] =
    current.reviewAppeals.find(_.id == appealId).toRight(ValidationMessages.Review.AppealNotFound)

private[utils] def findEligibilityReview(
      current: DeliveryAppState,
      reviewId: EligibilityReviewId,
  ): Either[ErrorMessage, EligibilityReview] =
    current.eligibilityReviews.find(_.id == reviewId).toRight(ValidationMessages.Review.EligibilityReviewNotFound)

private[utils] def requirePendingAppeal(
      appeal: ReviewAppeal
  ): Either[ErrorMessage, Unit] =
    Either.cond(
      appeal.status == AppealStatus.Pending,
      (),
      ValidationMessages.Review.AppealAlreadyResolved,
    )

private[utils] def requirePendingEligibilityReview(
      review: EligibilityReview
  ): Either[ErrorMessage, Unit] =
    Either.cond(
      review.status == AppealStatus.Pending,
      (),
      ValidationMessages.Review.EligibilityReviewAlreadyResolved,
    )

private[utils] def sanitizeAppealReason(
      reason: ReasonText
  ): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.Review.AppealReasonRequired,
    )

private[utils] def sanitizeEligibilityReason(
      reason: ReasonText
  ): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.Review.EligibilityReviewReasonRequired,
    )

private[utils] def sanitizeResolutionNote(
      value: ResolutionText,
      missingError: ErrorMessage,
  ): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      missingError,
    )

private[utils] def buildReviewAppeal(
      order: OrderSummary,
      appellantRole: AppealRole,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): ReviewAppeal =
    ReviewAppeal(
      identity = ReviewAppealIdentity(
        id = nextId(wrapText[DisplayText]("apl")),
        orderId = order.id,
        customerId = order.customerId,
        customerName = order.customerName,
        storeId = order.storeId,
        riderId = order.riderId,
      ),
      decision = ReviewAppealDecision(
        appellantRole = appellantRole,
        reason = reason,
      ),
      review = ReviewAppealReview(
        status = AppealStatus.Pending,
        resolutionNote = None,
        submittedAt = timestamp,
        reviewedAt = None,
      ),
    )

private[utils] def reviewAppeal(
      appeal: ReviewAppeal,
      approved: ApprovalFlag,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): ReviewAppeal =
    appeal.copy(
      review = appeal.review.copy(
        status = if approved then AppealStatus.Approved else AppealStatus.Rejected,
        resolutionNote = Some(resolutionNote),
        reviewedAt = Some(timestamp),
      ),
    )

private[utils] def buildEligibilityReview(
      request: EligibilityReviewRequest,
      targetName: DisplayText,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): EligibilityReview =
    EligibilityReview(
      id = nextId(wrapText[DisplayText]("eqr")),
      target = request.target,
      targetId = request.targetId,
      targetName = targetName,
      reason = reason,
      status = AppealStatus.Pending,
      resolutionNote = None,
      submittedAt = timestamp,
      reviewedAt = None,
    )

private[utils] def reviewEligibility(
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

private[utils] def hasResolvableAdminTicket(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, Unit] =
    current.tickets
      .find(ticket =>
        ticket.orderId == orderId &&
          ticket.status == TicketStatus.Open &&
          ticket.kind != TicketKind.DeliveryIssue,
      )
      .toRight(ValidationMessages.Review.NoPendingTicket)
      .map(_ => ())

private[utils] def resolveAdminTickets(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionText: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open && ticket.kind != TicketKind.DeliveryIssue then
        ticket.copy(
          identity = ticket.identity.copy(status = TicketStatus.Resolved),
          resolution = ticket.resolution.copy(
            approved = None,
            resolutionNote = Some(resolutionText),
            reviewedAt = Some(timestamp),
          ),
          lifecycle = ticket.lifecycle.copy(updatedAt = timestamp),
        )
      else ticket
    )
