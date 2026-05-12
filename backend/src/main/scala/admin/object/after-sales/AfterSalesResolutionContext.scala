package domain.admin

import domain.order.*
import domain.shared.*

final case class AfterSalesResolutionContext(
    request: ResolveAfterSalesRequest,
    ticket: AdminTicket,
    order: OrderSummary,
    requestType: AfterSalesRequestType,
    resolutionMode: AfterSalesResolutionMode,
)
