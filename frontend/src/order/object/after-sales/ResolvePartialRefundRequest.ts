import type { ApprovalFlag, ResolutionText } from '@/shared/object/domain/DomainObjects'

export type ResolvePartialRefundRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
