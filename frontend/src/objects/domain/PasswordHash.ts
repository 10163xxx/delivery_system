import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type PasswordHashTag = { readonly passwordHashBrand: never }

export type PasswordHash = TextDomainValue<PasswordHashTag>
