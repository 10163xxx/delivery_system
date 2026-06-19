// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
import type { TextDomainValue } from '@/objects/system/support/DomainValueTypeSupport'

type HostNameTag = { readonly hostNameBrand: never }

export type HostName = TextDomainValue<HostNameTag>
