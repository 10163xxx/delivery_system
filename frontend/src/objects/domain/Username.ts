import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type UsernameTag = { readonly usernameBrand: never }

export type Username = TextDomainValue<UsernameTag>
