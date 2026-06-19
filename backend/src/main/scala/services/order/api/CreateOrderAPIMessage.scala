package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.order.objects.apiTypes.CreateOrderRequest
import system.app.objects.{DeliveryAppState}
import system.api.*

val createOrderApi: FixedMethodApi[NoPathParams, DeliveryAppState] =
  jsonPostApi[CreateOrderRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("orders"),
  )
