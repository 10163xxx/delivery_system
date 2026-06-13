import type { ApprovalFlag, ResolutionText } from '@/objects/core/SharedObjects'

export type ResolvePartialRefundRequest = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}
