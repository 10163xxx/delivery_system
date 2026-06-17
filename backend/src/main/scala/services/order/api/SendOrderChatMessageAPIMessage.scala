package services.order.api

import domain.shared.given

import domain.order.SendOrderChatMessageRequest
import domain.shared.{ApprovalFlag, CustomerId, DeliveryAppState, OrderId}
import system.api.*

val sendOrderChatMessageApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, SendOrderChatMessageRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("chat")),
  )
