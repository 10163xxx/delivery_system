import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ParameterIndexTag = { readonly parameterIndexBrand: never }

export type ParameterIndex = NumericDomainValue<ParameterIndexTag>
