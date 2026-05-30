import type { ApprovalFlag, ResolutionText } from '@/objects/domain/DomainObjects'

export type ResolveReviewAppealRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
