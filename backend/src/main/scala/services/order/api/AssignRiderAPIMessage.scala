package services.order.api

import domain.shared.given

import domain.order.AssignRiderRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val assignRiderApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, AssignRiderRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("assign-rider")),
  )
