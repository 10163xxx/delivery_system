package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.order.objects.apiTypes.ResolveAfterSalesRequest
import system.app.objects.{DeliveryAppState}
import services.admin.objects.{TicketId}
import system.api.*

val resolveAfterSalesTicketApi: FixedMethodApi[PathParam[TicketId], DeliveryAppState] =
  jsonPostApi[TicketId, ResolveAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("tickets")),
    List(routeSegment("afterSales"), routeSegment("review")),
  )
