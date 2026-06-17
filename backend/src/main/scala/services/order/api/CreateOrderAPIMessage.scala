package services.order.api

import domain.shared.given

import domain.order.CreateOrderRequest
import domain.shared.{DeliveryAppState}
import system.api.*

val createOrderApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[CreateOrderRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("orders"),
  )
