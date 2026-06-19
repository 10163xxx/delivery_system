package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import services.customer.objects.Coupon
import system.objects.*

final case class OrderSummaryPricing(
    itemSubtotalCents: CurrencyCents,
    deliveryFeeCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    appliedCoupon: Option[Coupon],
    totalPriceCents: CurrencyCents,
)
