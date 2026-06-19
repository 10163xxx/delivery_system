// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { ResolutionText } from '@/objects/core/SharedObjects'

export type ReviewMerchantApplicationRequest = {
  reviewNote: ResolutionText
}
