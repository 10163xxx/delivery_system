package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.order.objects.apiTypes.SubmitPartialRefundRequest
import system.app.objects.{DeliveryAppState}
import services.order.objects.{OrderId}
import system.api.*

val submitPartialRefundRequestApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, SubmitPartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("partial-refunds")),
  )
