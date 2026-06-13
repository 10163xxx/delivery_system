import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PersonNameTag = { readonly personNameBrand: never }

export type PersonName = TextDomainValue<PersonNameTag>
