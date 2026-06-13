import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ImageUrlTag = { readonly imageUrlBrand: never }

export type ImageUrl = TextDomainValue<ImageUrlTag>
