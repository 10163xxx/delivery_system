import type {
  IsoDateTime,
  RatingValue,
  ReasonText,
  ReviewStatus,
} from '@/objects/core/SharedObjects'

export type OrderSummaryReviewState = {
  storeRating?: RatingValue
  riderRating?: RatingValue
  merchantRejectReason?: ReasonText
  reviewStatus: ReviewStatus
  reviewRevokedReason?: ReasonText
  reviewRevokedAt?: IsoDateTime
}
