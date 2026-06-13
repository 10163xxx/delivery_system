import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type BankNameTag = { readonly bankNameBrand: never }

export type BankName = TextDomainValue<BankNameTag>
