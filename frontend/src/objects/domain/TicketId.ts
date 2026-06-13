import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type TicketIdTag = { readonly ticketIdBrand: never }

export type TicketId = TextDomainValue<TicketIdTag>
