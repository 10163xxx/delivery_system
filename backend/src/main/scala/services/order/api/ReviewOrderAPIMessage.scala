package services.order.api

import domain.shared.given

import domain.review.ReviewOrderRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val reviewOrderApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, ReviewOrderRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("review")),
  )
