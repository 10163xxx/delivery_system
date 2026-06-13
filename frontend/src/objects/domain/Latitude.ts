import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type LatitudeTag = { readonly latitudeBrand: never }

export type Latitude = NumericDomainValue<LatitudeTag>
