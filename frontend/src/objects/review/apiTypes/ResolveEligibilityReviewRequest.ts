// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { ApprovalFlag, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolveEligibilityReviewRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
