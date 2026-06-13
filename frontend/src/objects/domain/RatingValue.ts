import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type RatingValueTag = { readonly ratingValueBrand: never }

export type RatingValue = NumericDomainValue<RatingValueTag>
