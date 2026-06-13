import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type RefundRequestIdTag = { readonly refundRequestIdBrand: never }

export type RefundRequestId = TextDomainValue<RefundRequestIdTag>
