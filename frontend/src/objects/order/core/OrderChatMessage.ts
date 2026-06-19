// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  ChatMessageId,
  DisplayText,
  IsoDateTime,
  PersonName,
  UserRole,
} from '@/objects/core/SharedObjects'

export type OrderChatMessage = {
  id: ChatMessageId
  senderRole: UserRole
  senderName: PersonName
  body: DisplayText
  sentAt: IsoDateTime
}
