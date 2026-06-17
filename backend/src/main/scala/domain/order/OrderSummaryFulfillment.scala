package domain.order

import domain.shared.*

final case class OrderSummaryFulfillment(
    status: OrderStatus,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    items: List[OrderLineItem],
)
