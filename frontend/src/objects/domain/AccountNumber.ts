import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AccountNumberTag = { readonly accountNumberBrand: never }

export type AccountNumber = TextDomainValue<AccountNumberTag>
