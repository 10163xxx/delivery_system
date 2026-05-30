import type { CurrencyCents } from '@/objects/domain/DomainObjects'

export type OrderPriceBreakdown = {
  itemSubtotalCents: CurrencyCents
  couponDiscountCents: CurrencyCents
  totalPriceCents: CurrencyCents
}
