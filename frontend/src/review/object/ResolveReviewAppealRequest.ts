import type { ApprovalFlag, ResolutionText } from '@/shared/object/domain/DomainObjects'

export type ResolveReviewAppealRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
