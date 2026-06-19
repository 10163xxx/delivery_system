// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { CurrencyCents } from '@/objects/core/SharedObjects'

export type OrderPriceBreakdown = {
  itemSubtotalCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  totalPriceCents: CurrencyCents
}
