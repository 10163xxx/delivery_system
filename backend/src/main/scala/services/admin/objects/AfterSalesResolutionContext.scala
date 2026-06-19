package services.admin.objects

// Business note: service-owned domain object; mirror it in the frontend only when it is part of the protocol surface.
import services.order.objects.*
import services.order.objects.apiTypes.*
import system.objects.*

final case class AfterSalesResolutionContext(
    request: ResolveAfterSalesRequest,
    ticket: AdminTicket,
    order: OrderSummary,
    requestType: AfterSalesRequestType,
    resolutionMode: AfterSalesResolutionMode,
)
