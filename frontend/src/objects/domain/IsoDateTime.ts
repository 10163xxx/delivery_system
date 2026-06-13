import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type IsoDateTimeTag = { readonly isoDateTimeBrand: never }

export type IsoDateTime = TextDomainValue<IsoDateTimeTag>
