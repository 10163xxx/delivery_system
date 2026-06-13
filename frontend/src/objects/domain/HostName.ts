import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type HostNameTag = { readonly hostNameBrand: never }

export type HostName = TextDomainValue<HostNameTag>
