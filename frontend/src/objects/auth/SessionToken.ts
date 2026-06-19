// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type SessionTokenTag = { readonly sessionTokenBrand: never }

export type SessionToken = TextDomainValue<SessionTokenTag>
