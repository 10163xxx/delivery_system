package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.*
import services.review.objects.*

final case class OrderSummaryReviewState(
    storeRating: Option[RatingValue],
    riderRating: Option[RatingValue],
    merchantRejectReason: Option[ReasonText],
    reviewStatus: ReviewStatus,
    reviewRevokedReason: Option[ReasonText],
    reviewRevokedAt: Option[IsoDateTime],
)
