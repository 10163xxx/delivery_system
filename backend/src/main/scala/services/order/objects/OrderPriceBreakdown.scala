package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.*

final case class OrderPriceBreakdown(
    itemSubtotalCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    totalPriceCents: CurrencyCents,
)
