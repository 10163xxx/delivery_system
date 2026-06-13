import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type UrlTextTag = { readonly urlTextBrand: never }

export type UrlText = TextDomainValue<UrlTextTag>
