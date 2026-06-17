package services.order.api

import domain.shared.given

import domain.order.ResolvePartialRefundRequest
import domain.shared.{DeliveryAppState, RefundRequestId}
import system.api.*

val resolvePartialRefundRequestApi: FixedMethodApi[PathParam[RefundRequestId], DeliveryAppState] =
  jsonPostApi[RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("partial-refunds")),
    List(routeSegment("review")),
  )
