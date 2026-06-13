import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PasswordTag = { readonly passwordBrand: never }

export type Password = TextDomainValue<PasswordTag>
