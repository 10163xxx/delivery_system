import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type AuthUserIdTag = { readonly authUserIdBrand: never }

export type AuthUserId = TextDomainValue<AuthUserIdTag>
