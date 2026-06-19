// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { ReviewSubmission } from '@/objects/review/ReviewSubmission'

export type ReviewOrderRequest = {
  storeReview?: ReviewSubmission
  riderReview?: ReviewSubmission
}
