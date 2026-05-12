import type {
  CouponId,
  CurrencyCents,
  DescriptionText,
  IsoDateTime,
} from '@/shared/object/domain/DomainObjects'

export type Coupon = {
  id: CouponId
  title: DescriptionText
  discountCents: CurrencyCents
  minimumSpendCents: CurrencyCents
  description: DescriptionText
  expiresAt: IsoDateTime
}
