import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ResolutionTextTag = { readonly resolutionTextBrand: never }

export type ResolutionText = TextDomainValue<ResolutionTextTag>
