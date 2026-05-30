import type {
  ChatMessageId,
  DisplayText,
  IsoDateTime,
  PersonName,
  UserRole,
} from '@/objects/domain/DomainObjects'

export type OrderChatMessage = {
  id: ChatMessageId
  senderRole: UserRole
  senderName: PersonName
  body: DisplayText
  sentAt: IsoDateTime
}
