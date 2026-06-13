import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PoolSizeTag = { readonly poolSizeBrand: never }

export type PoolSize = NumericDomainValue<PoolSizeTag>
