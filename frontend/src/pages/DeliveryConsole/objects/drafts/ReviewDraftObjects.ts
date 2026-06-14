import type {
  NoteText,
  OrderId,
  RatingValue,
  ReasonText,
} from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'

export type ReviewDraft = {
  rating: RatingValue
  comment: ReasonText
  extraNote: NoteText
}

export type ReviewTargetValue = (typeof REVIEW_TARGET)[keyof typeof REVIEW_TARGET]
export type ReviewDraftKey = `${OrderId}-${ReviewTargetValue}`

export function buildReviewDraftKey(
  orderId: OrderId,
  target: ReviewTargetValue,
): ReviewDraftKey {
  return `${orderId}-${target}`
}
