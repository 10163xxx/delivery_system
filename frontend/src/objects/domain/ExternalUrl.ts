import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ExternalUrlTag = { readonly externalUrlBrand: never }

export type ExternalUrl = TextDomainValue<ExternalUrlTag>
