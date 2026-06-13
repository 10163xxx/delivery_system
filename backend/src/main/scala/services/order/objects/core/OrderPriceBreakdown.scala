package domain.order

import domain.shared.*

final case class OrderPriceBreakdown(
    itemSubtotalCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    totalPriceCents: CurrencyCents,
)
