import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MerchantApplicationIdTag = { readonly merchantApplicationIdBrand: never }

export type MerchantApplicationId = TextDomainValue<MerchantApplicationIdTag>
