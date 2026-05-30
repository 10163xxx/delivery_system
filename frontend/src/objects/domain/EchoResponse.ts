import type { ApprovalFlag, DisplayText } from '@/objects/domain/DomainObjects'

export type EchoResponse = {
  message: DisplayText
  transformed: ApprovalFlag
}
