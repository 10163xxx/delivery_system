package services.admin.api

import domain.shared.given

import domain.admin.ResolveTicketRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val resolveTicketApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, ResolveTicketRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("resolve")),
  )
