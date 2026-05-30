import type { ApprovalFlag, ResolutionText } from '@/objects/domain/DomainObjects'

export type ResolveEligibilityReviewRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
