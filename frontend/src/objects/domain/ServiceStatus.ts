import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type ServiceStatusTag = { readonly serviceStatusBrand: never }

export type ServiceStatus = TextDomainValue<ServiceStatusTag>
