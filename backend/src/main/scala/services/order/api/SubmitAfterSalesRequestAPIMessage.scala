package services.order.api

import domain.shared.given

import domain.order.SubmitAfterSalesRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val submitAfterSalesRequestApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, SubmitAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("afterSales")),
  )
