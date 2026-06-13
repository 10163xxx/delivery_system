import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ServiceNameTag = { readonly serviceNameBrand: never }

export type ServiceName = TextDomainValue<ServiceNameTag>
