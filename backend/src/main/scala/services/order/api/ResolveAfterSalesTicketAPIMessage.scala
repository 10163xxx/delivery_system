package services.order.api

import domain.shared.given

import domain.order.ResolveAfterSalesRequest
import domain.shared.{DeliveryAppState, TicketId}
import system.api.*

val resolveAfterSalesTicketApi: FixedMethodApi[PathParam[TicketId], DeliveryAppState] =
  jsonPostApi[TicketId, ResolveAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("tickets")),
    List(routeSegment("afterSales"), routeSegment("review")),
  )
