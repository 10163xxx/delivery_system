import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PercentageValueTag = { readonly percentageValueBrand: never }

export type PercentageValue = NumericDomainValue<PercentageValueTag>
