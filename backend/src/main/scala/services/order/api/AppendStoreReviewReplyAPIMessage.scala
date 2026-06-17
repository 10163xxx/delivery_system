package services.order.api

import domain.shared.given

import domain.order.AppendStoreReviewReplyRequest
import domain.shared.{DeliveryAppState, OrderId}
import system.api.*

val appendStoreReviewReplyApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, AppendStoreReviewReplyRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("store-review-reply")),
  )
