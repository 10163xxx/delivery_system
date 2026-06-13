import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ChatMessageIdTag = { readonly chatMessageIdBrand: never }

export type ChatMessageId = TextDomainValue<ChatMessageIdTag>
