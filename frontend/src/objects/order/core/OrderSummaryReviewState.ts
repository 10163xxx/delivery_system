// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
