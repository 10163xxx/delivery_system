import type { ApprovalFlag, DisplayText } from '@/objects/domain/DomainObjects'

export type EchoRequest = {
  message: DisplayText
  uppercase: ApprovalFlag
}
