import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type MerchantWithdrawalIdTag = { readonly merchantWithdrawalIdBrand: never }

export type MerchantWithdrawalId = TextDomainValue<MerchantWithdrawalIdTag>
