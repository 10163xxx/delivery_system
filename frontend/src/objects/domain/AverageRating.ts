import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AverageRatingTag = { readonly averageRatingBrand: never }

export type AverageRating = NumericDomainValue<AverageRatingTag>
