import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MerchantIdTag = { readonly merchantIdBrand: never }

export type MerchantId = TextDomainValue<MerchantIdTag>
