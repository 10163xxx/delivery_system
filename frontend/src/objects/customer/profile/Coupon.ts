// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
