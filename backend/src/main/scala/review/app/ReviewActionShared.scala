package review.app

import domain.shared.given

import domain.admin.*
import domain.order.*
import domain.review.*
import domain.shared.*
import shared.app.*

private[app] def findReviewOrder(
      current: DeliveryAppState,
      orderId: OrderId,
  ): Either[ErrorMessage, OrderSummary] =
    current.orders.find(_.id == orderId).toRight(ValidationMessages.Order.OrderNotFound)

private[app] def findReviewAppeal(
      current: DeliveryAppState,
      appealId: ReviewAppealId,
  ): Either[ErrorMessage, ReviewAppeal] =
    current.reviewAppeals.find(_.id == appealId).toRight(ValidationMessages.Review.AppealNotFound)

private[app] def findEligibilityReview(
      current: DeliveryAppState,
      reviewId: EligibilityReviewId,
  ): Either[ErrorMessage, EligibilityReview] =
    current.eligibilityReviews.find(_.id == reviewId).toRight(ValidationMessages.Review.EligibilityReviewNotFound)

private[app] def requirePendingAppeal(
      appeal: ReviewAppeal
  ): Either[ErrorMessage, Unit] =
    Either.cond(
      appeal.status == AppealStatus.Pending,
      (),
      ValidationMessages.Review.AppealAlreadyResolved,
    )

private[app] def requirePendingEligibilityReview(
      review: EligibilityReview
  ): Either[ErrorMessage, Unit] =
    Either.cond(
      review.status == AppealStatus.Pending,
      (),
      ValidationMessages.Review.EligibilityReviewAlreadyResolved,
    )

private[app] def sanitizeAppealReason(
      reason: ReasonText
  ): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.Review.AppealReasonRequired,
    )

private[app] def sanitizeEligibilityReason(
      reason: ReasonText
  ): Either[ErrorMessage, ReasonText] =
    sanitizeRequiredText(
      reason,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      ValidationMessages.Review.EligibilityReviewReasonRequired,
    )

private[app] def sanitizeResolutionNote(
      value: ResolutionText,
      missingError: ErrorMessage,
  ): Either[ErrorMessage, ResolutionText] =
    sanitizeRequiredText(
      value,
      DeliveryValidationDefaults.OrderReasonMaxLength,
      missingError,
    )

private[app] def buildReviewAppeal(
      order: OrderSummary,
      appellantRole: AppealRole,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): ReviewAppeal =
    ReviewAppeal(
      id = nextId(wrapText[DisplayText]("apl")),
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

private[app] def reviewAppeal(
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

private[app] def buildEligibilityReview(
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

private[app] def reviewEligibility(
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

private[app] def hasResolvableAdminTicket(
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

private[app] def resolveAdminTickets(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionText: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open && ticket.kind != TicketKind.DeliveryIssue then
        ticket.copy(
          status = TicketStatus.Resolved,
          resolution = ticket.resolution.copy(
            approved = None,
            resolutionNote = Some(resolutionText),
            reviewedAt = Some(timestamp),
          ),
          updatedAt = timestamp,
        )
      else ticket
    )
