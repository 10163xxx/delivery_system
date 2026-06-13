import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PortNumberTag = { readonly portNumberBrand: never }

export type PortNumber = NumericDomainValue<PortNumberTag>
