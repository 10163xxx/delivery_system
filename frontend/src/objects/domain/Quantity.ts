import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type QuantityTag = { readonly quantityBrand: never }

export type Quantity = NumericDomainValue<QuantityTag>
