package services.order.api

import domain.shared.given

import domain.order.RejectOrderRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val rejectOrderApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, RejectOrderRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("reject")),
  )
