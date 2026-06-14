import type { ApprovalFlag, DisplayText } from '@/objects/core/SharedObjects'

export type EchoResponse = {
  message: DisplayText
  transformed: ApprovalFlag
}
