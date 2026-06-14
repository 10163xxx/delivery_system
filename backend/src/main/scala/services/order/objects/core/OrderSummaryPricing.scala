package domain.order

import domain.customer.Coupon
import domain.shared.*

final case class OrderSummaryPricing(
    itemSubtotalCents: CurrencyCents,
    deliveryFeeCents: CurrencyCents,
    couponDiscountCents: CurrencyCents,
    appliedCoupon: Option[Coupon],
    totalPriceCents: CurrencyCents,
)
