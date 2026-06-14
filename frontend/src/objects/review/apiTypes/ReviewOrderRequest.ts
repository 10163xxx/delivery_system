import type { ReviewSubmission } from '@/objects/review/ReviewSubmission'

export type ReviewOrderRequest = {
  storeReview?: ReviewSubmission
  riderReview?: ReviewSubmission
}
