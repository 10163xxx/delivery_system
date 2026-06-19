package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.review.objects.apiTypes.ReviewOrderRequest
import system.app.objects.{DeliveryAppState}
import services.order.objects.{OrderId}
import system.api.*

val reviewOrderApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, ReviewOrderRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("review")),
  )
