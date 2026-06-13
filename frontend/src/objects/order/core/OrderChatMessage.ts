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
