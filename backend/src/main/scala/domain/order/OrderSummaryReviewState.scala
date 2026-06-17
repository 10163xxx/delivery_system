package domain.order

import domain.shared.*

final case class OrderSummaryReviewState(
    storeRating: Option[RatingValue],
    riderRating: Option[RatingValue],
    merchantRejectReason: Option[ReasonText],
    reviewStatus: ReviewStatus,
    reviewRevokedReason: Option[ReasonText],
    reviewRevokedAt: Option[IsoDateTime],
)
