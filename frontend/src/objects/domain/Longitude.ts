import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type LongitudeTag = { readonly longitudeBrand: never }

export type Longitude = NumericDomainValue<LongitudeTag>
