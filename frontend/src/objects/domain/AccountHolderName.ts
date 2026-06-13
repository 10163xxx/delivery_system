import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AccountHolderNameTag = { readonly accountHolderNameBrand: never }

export type AccountHolderName = TextDomainValue<AccountHolderNameTag>
