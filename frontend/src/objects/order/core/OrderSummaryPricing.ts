// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { CurrencyCents } from '@/objects/core/SharedObjects'
import type { Coupon } from '@/objects/customer/profile/Coupon'

export type OrderSummaryPricing = {
  itemSubtotalCents: CurrencyCents
  deliveryFeeCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  appliedCoupon?: Coupon
  totalPriceCents: CurrencyCents
}
