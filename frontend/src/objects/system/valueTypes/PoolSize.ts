// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { NumericDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type PoolSizeTag = { readonly poolSizeBrand: never }

export type PoolSize = NumericDomainValue<PoolSizeTag>
