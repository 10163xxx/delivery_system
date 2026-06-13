import type { TextDomainValue } from '@/objects/domain/DomainValueTypeSupport'

type CouponIdTag = { readonly couponIdBrand: never }

export type CouponId = TextDomainValue<CouponIdTag>
