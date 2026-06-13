import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type EntityCountTag = { readonly entityCountBrand: never }

export type EntityCount = NumericDomainValue<EntityCountTag>
