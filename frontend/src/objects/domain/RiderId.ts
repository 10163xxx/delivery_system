import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type RiderIdTag = { readonly riderIdBrand: never }

export type RiderId = TextDomainValue<RiderIdTag>
