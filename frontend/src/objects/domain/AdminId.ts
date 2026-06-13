import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AdminIdTag = { readonly adminIdBrand: never }

export type AdminId = TextDomainValue<AdminIdTag>
