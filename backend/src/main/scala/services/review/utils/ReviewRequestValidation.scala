package services.review.utils

// Business note: service business action/support code; keep validation and state transitions explicit and side effects in IO.
import system.app.*

import system.objects.given
import services.review.objects.apiTypes.*
import system.app.objects.*

import services.order.objects.*
import services.review.objects.*
import system.objects.*

private val merchantReviewLabel = text("商家")
private val riderReviewLabel = text("骑手")

def validateReviewRequest(
    request: ReviewOrderRequest
): Either[ErrorMessage, ReviewOrderRequest] =
  for
    _ <- Either.cond(request.storeReview.nonEmpty || request.riderReview.nonEmpty, (), ValidationMessages.Review.ReviewRequired)
    storeReview <- validateReviewSubmission(request.storeReview, merchantReviewLabel)
    riderReview <- validateReviewSubmission(request.riderReview, riderReviewLabel)
  yield ReviewOrderRequest(
    storeReview = storeReview,
    riderReview = riderReview,
  )

private def validateReviewSubmission(
    review: Option[ReviewSubmission],
    label: DisplayText,
): Either[ErrorMessage, Option[ReviewSubmission]] =
  review match
    case None => Right(None)
    case Some(value) =>
      for
        _ <- Either.cond(
          value.rating >= DeliveryValidationDefaults.ReviewRatingMin &&
            value.rating <= DeliveryValidationDefaults.ReviewRatingMax,
          (),
          reviewRatingInvalid(label),
        )
        comment = sanitizeOptionalText(value.comment, DeliveryValidationDefaults.ReviewCommentMaxLength)
        _ <- Either.cond(
          value.rating == DeliveryValidationDefaults.ReviewRatingMax || comment.nonEmpty,
          (),
          lowRatingCommentRequired(label),
        )
      yield Some(
        ReviewSubmission(
          rating = value.rating,
          comment = comment,
          extraNote = sanitizeOptionalText(value.extraNote, DeliveryValidationDefaults.ReviewExtraNoteMaxLength),
        )
      )

def applyReviewToOrder(
    order: OrderSummary,
    request: ReviewOrderRequest,
    timestamp: IsoDateTime,
): OrderSummary =
  val noteSegments = List(
    request.storeReview.map(review => renderReviewRatingLabel(merchantReviewLabel, review.rating)),
    request.riderReview.map(review => renderReviewRatingLabel(riderReviewLabel, review.rating)),
  ).flatten
  order.copy(
    reviewState = order.reviewState.copy(
      storeRating = request.storeReview.map(_.rating).orElse(order.storeRating),
      riderRating = request.riderReview.map(_.rating).orElse(order.riderRating),
      merchantRejectReason = order.merchantRejectReason,
      reviewStatus = ReviewStatus.Active,
    ),
    reviewContent = order.reviewContent.copy(
      reviewComment = request.storeReview.flatMap(_.comment).orElse(request.riderReview.flatMap(_.comment)).orElse(order.reviewComment),
      reviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(request.riderReview.flatMap(_.extraNote)).orElse(order.reviewExtraNote),
      storeReviewComment = request.storeReview.flatMap(_.comment).orElse(order.storeReviewComment),
      storeReviewExtraNote = request.storeReview.flatMap(_.extraNote).orElse(order.storeReviewExtraNote),
      riderReviewComment = request.riderReview.flatMap(_.comment).orElse(order.riderReviewComment),
      riderReviewExtraNote = request.riderReview.flatMap(_.extraNote).orElse(order.riderReviewExtraNote),
    ),
    lifecycle = order.lifecycle.copy(updatedAt = timestamp),
    activity = order.activity.copy(
      timeline = order.timeline :+ OrderTimelineEntry(
        OrderStatus.Completed,
        renderOrderTimelineMessage(OrderTimelineMessage.CustomerReviewSubmitted(noteSegments)),
        timestamp,
      )
    ),
  )
