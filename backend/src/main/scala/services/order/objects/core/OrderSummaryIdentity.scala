package domain.order

import domain.shared.*

final case class OrderSummaryIdentity(
    id: OrderId,
    customerId: CustomerId,
    customerName: PersonName,
    storeId: StoreId,
    storeName: DisplayText,
    riderId: Option[RiderId],
    riderName: Option[PersonName],
)
