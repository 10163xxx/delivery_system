import type { ApprovalFlag, ResolutionText } from '@/shared/object/domain/DomainObjects'

export type ResolveEligibilityReviewRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
