import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type OrderIdTag = { readonly orderIdBrand: never }

export type OrderId = TextDomainValue<OrderIdTag>
