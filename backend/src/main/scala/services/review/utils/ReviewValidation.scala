package services.review.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.app.*

import system.objects.given
import system.app.objects.*

import services.admin.objects.*
import services.order.objects.*
import services.review.objects.*
import system.objects.*

def validateAppealRole(
      order: OrderSummary,
      appellantRole: AppealRole,
  ): Either[ErrorMessage, Unit] =
    appellantRole match
      case AppealRole.Merchant => Either.cond(order.storeRating.nonEmpty, (), ValidationMessages.Review.StoreReviewAppealUnavailable)
      case AppealRole.Rider => Either.cond(order.riderId.nonEmpty && order.riderRating.nonEmpty, (), ValidationMessages.Review.RiderReviewAppealUnavailable)

def revokeReview(
      order: OrderSummary,
      reason: ReasonText,
      timestamp: IsoDateTime,
  ): OrderSummary =
    order.copy(
      reviewState = order.reviewState.copy(
        reviewStatus = ReviewStatus.Revoked,
        reviewRevokedReason = Some(reason),
        reviewRevokedAt = Some(timestamp),
      ),
      lifecycle = order.lifecycle.copy(updatedAt = timestamp),
      activity = order.activity.copy(
        timeline = order.timeline :+ OrderTimelineEntry(
          OrderStatus.Completed,
          renderOrderTimelineMessage(OrderTimelineMessage.ReviewRevoked(reason)),
          timestamp,
        )
      ),
    )

def closeTicketsForOrder(
      tickets: List[AdminTicket],
      orderId: OrderId,
      resolutionNote: ResolutionText,
      timestamp: IsoDateTime,
  ): List[AdminTicket] =
    tickets.map(ticket =>
      if ticket.orderId == orderId && ticket.status == TicketStatus.Open then
        ticket.copy(
          identity = ticket.identity.copy(status = TicketStatus.Resolved),
          resolution = ticket.resolution.copy(
            approved = None,
            resolutionNote = Some(resolutionNote),
            reviewedAt = Some(timestamp),
          ),
          lifecycle = ticket.lifecycle.copy(updatedAt = timestamp),
        )
      else ticket
    )
