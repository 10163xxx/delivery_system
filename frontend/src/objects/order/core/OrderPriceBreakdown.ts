import type { CurrencyCents } from '@/objects/core/SharedObjects'

export type OrderPriceBreakdown = {
  itemSubtotalCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  totalPriceCents: CurrencyCents
}
