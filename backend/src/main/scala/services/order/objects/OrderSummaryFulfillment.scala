package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.*
import services.customer.objects.*

final case class OrderSummaryFulfillment(
    status: OrderStatus,
    deliveryAddress: AddressText,
    scheduledDeliveryAt: IsoDateTime,
    remark: Option[NoteText],
    items: List[OrderLineItem],
)
