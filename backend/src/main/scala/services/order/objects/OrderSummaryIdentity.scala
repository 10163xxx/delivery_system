package services.order.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import system.objects.*
import services.rider.objects.*
import services.merchant.objects.*
import services.customer.objects.*

final case class OrderSummaryIdentity(
    id: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    storeName: DisplayText,
    riderId: Option[RiderId],
    riderName: Option[PersonName],
)
