import type { ApprovalFlag, ResolutionText } from '@/objects/domain/DomainObjects'

export type ResolvePartialRefundRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
