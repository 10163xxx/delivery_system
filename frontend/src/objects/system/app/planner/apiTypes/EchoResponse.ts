// Business note: planner protocol DTO shared with backend planner APIs; keep field names and value object types aligned.
import type { ApprovalFlag, DisplayText } from '@/objects/core/SharedObjects'

export type EchoResponse = {
  message: DisplayText
  transformed: ApprovalFlag
}
