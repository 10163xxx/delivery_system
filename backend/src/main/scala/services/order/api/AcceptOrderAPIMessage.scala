package services.order.api

import domain.shared.given

import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val acceptOrderApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, Unit, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("accept")),
  )
