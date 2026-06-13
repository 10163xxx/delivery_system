import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type SessionTokenTag = { readonly sessionTokenBrand: never }

export type SessionToken = TextDomainValue<SessionTokenTag>
