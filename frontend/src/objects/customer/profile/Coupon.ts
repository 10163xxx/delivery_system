import type {
  CouponId,
  CurrencyCents,
  DescriptionText,
  DisplayText,
  IsoDateTime,
} from '@/objects/core/SharedObjects'

export type Coupon = {
  id: CouponId
  title: DisplayText
  discountCents: CurrencyCents
  minimumSpendCents: CurrencyCents
  description: DescriptionText
  expiresAt: IsoDateTime
}
