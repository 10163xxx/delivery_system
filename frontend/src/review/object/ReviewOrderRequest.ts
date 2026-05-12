import type { ReviewSubmission } from '@/review/object/ReviewSubmission'

export type ReviewOrderRequest = {
  storeReview?: ReviewSubmission
  riderReview?: ReviewSubmission
}
