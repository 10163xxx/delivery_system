package domain.order

import domain.shared.*

final case class OrderSummaryLifecycle(
    createdAt: IsoDateTime,
    updatedAt: IsoDateTime,
)
