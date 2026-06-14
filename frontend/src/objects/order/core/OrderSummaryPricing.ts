import type { CurrencyCents } from '@/objects/core/SharedObjects'
import type { Coupon } from '@/objects/customer/profile/Coupon'

export type OrderSummaryPricing = {
  itemSubtotalCents: CurrencyCents
  deliveryFeeCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  appliedCoupon?: Coupon
  totalPriceCents: CurrencyCents
}
