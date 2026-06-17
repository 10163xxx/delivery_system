package services.order.api

import domain.shared.given

import domain.order.SubmitPartialRefundRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val submitPartialRefundRequestApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, SubmitPartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("partial-refunds")),
  )
