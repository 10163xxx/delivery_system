import type { ApprovalFlag, DisplayText } from '@/objects/core/SharedObjects'

export type EchoRequest = {
  message: DisplayText
  uppercase: ApprovalFlag
}
