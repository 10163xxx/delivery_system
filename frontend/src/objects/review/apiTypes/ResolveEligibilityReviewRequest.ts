import type { ApprovalFlag, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolveEligibilityReviewRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
