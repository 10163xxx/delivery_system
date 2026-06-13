import type { NumericDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ByteCountTag = { readonly byteCountBrand: never }

export type ByteCount = NumericDomainValue<ByteCountTag>
