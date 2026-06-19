package services.review.utils

// Business note: review-ticket creation rules derived from customer review ratings and comments.
import system.app.*

import system.objects.given
import services.review.objects.apiTypes.*
import system.app.objects.*
import services.auth.objects.*

import services.admin.objects.*
import services.order.objects.*
import services.review.objects.*
import system.objects.*

private val merchantReviewLabel = text("商家")
private val riderReviewLabel = text("骑手")
private val reviewDetailSeparator = text("；")

private def joinReviewDetails(details: List[DisplayText]): DisplayText =
  text(details.map(_.raw).mkString(reviewDetailSeparator.raw))

def reviewTicket(
    order: OrderSummary,
    request: ReviewOrderRequest,
    timestamp: IsoDateTime,
): Option[AdminTicket] =
  val ratings = List(request.storeReview.map(_.rating), request.riderReview.map(_.rating)).flatten
  if ratings.isEmpty then None
  else
    val lowestRating = ratings.min
    val highestRating = ratings.max
    val ticketKind =
      if lowestRating <= NumericDefaults.NegativeReviewThreshold then Some(TicketKind.NegativeReview)
      else if highestRating >= NumericDefaults.PositiveReviewThreshold then Some(TicketKind.PositiveReview)
      else None

    ticketKind.map(kind =>
      AdminTicket(
        identity = AdminTicketIdentity(
          id = nextId(text("tkt")),
          orderId = order.id,
          kind = kind,
          status = TicketStatus.Open,
          summary = buildTicketSummary(order, request, kind),
        ),
        submission = AdminTicketSubmission(
          requestType = None,
          submittedByRole = Some(UserRole.customer),
          submittedByName = Some(order.customerName),
          expectedCompensationCents = None,
          submittedAt = timestamp,
        ),
        resolution = AdminTicketResolution(
          actualCompensationCents = None,
          approved = None,
          resolutionMode = None,
          issuedCoupon = None,
          reviewedAt = None,
          resolutionNote = None,
        ),
        lifecycle = AdminTicketLifecycle(updatedAt = timestamp),
      )
    )

private def buildTicketSummary(
    order: OrderSummary,
    request: ReviewOrderRequest,
    kind: TicketKind,
): SummaryText =
  val detail = joinReviewDetails(List(
    request.storeReview.map(review =>
      renderReviewDetail(merchantReviewLabel, review.rating, review.comment, review.extraNote)
    ),
    request.riderReview.map(review =>
      renderReviewDetail(riderReviewLabel, review.rating, review.comment, review.extraNote)
    ),
  ).flatten)
  kind match
    case TicketKind.PositiveReview =>
      renderReviewTicketSummary(ReviewTicketSummaryMessage.Positive(order.customerName, order.storeName, detail))
    case TicketKind.NegativeReview =>
      renderReviewTicketSummary(ReviewTicketSummaryMessage.Negative(order.customerName, detail))
    case TicketKind.DeliveryIssue =>
      renderReviewTicketSummary(ReviewTicketSummaryMessage.DeliveryIssue(order.customerName, detail))
