import type {
  ChatMessageId,
  DescriptionText,
  IsoDateTime,
  PersonName,
  Role,
} from '@/shared/object/domain/DomainObjects'

export type OrderChatMessage = {
  id: ChatMessageId
  senderRole: Role
  senderName: PersonName
  body: DescriptionText
  sentAt: IsoDateTime
}
