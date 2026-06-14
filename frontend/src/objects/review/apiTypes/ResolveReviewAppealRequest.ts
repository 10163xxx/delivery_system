import type { ApprovalFlag, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolveReviewAppealRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
