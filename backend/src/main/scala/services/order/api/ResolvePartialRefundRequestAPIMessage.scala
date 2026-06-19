package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.order.objects.apiTypes.ResolvePartialRefundRequest
import system.app.objects.{DeliveryAppState}
import services.order.objects.{RefundRequestId}
import system.api.*

val resolvePartialRefundRequestApi: FixedMethodApi[PathParam[RefundRequestId], DeliveryAppState] =
  jsonPostApi[RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("partial-refunds")),
    List(routeSegment("review")),
  )
