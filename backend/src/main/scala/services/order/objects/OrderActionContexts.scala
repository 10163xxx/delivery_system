package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import services.customer.objects.*
import services.review.objects.apiTypes.*
import services.merchant.objects.*
import services.review.objects.*
import system.objects.*

final case class CreateOrderContext(
    customer: Customer,
    store: Store,
    timestamp: IsoDateTime,
    items: List[OrderLineItem],
    deliveryAddress: AddressText,
    deliveryFeeCents: CurrencyCents,
    scheduledDeliveryAt: IsoDateTime,
    appliedCoupon: Option[Coupon],
    priceBreakdown: OrderPriceBreakdown,
    remark: Option[NoteText],
)

final case class RejectOrderContext(
    order: OrderSummary,
    reason: ReasonText,
    timestamp: IsoDateTime,
)

final case class ReviewOrderContext(
    order: OrderSummary,
    customer: Customer,
    timestamp: IsoDateTime,
    sanitized: ReviewOrderRequest,
)
