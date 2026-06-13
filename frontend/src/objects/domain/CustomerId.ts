import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type CustomerIdTag = { readonly customerIdBrand: never }

export type CustomerId = TextDomainValue<CustomerIdTag>
