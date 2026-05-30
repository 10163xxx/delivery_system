import type {
  CouponId,
  CurrencyCents,
  DescriptionText,
  DisplayText,
  IsoDateTime,
} from '@/objects/domain/DomainObjects'

export type Coupon = {
  id: CouponId
  title: DisplayText
  discountCents: CurrencyCents
  minimumSpendCents: CurrencyCents
  description: DescriptionText
  expiresAt: IsoDateTime
}
