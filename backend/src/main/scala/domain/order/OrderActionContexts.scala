package domain.order

import domain.customer.*
import domain.merchant.*
import domain.review.*
import domain.shared.*

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
