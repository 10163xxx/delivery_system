import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MediaTypeTextTag = { readonly mediaTypeTextBrand: never }

export type MediaTypeText = TextDomainValue<MediaTypeTextTag>
