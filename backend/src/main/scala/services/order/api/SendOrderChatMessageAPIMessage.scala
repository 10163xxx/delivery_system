package services.order.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.order.objects.apiTypes.SendOrderChatMessageRequest
import system.objects.{ApprovalFlag}
import system.app.objects.{DeliveryAppState}
import services.customer.objects.{CustomerId}
import services.order.objects.{OrderId}
import system.api.*

val sendOrderChatMessageApi: FixedMethodApi[PathParam[OrderId], DeliveryAppState] =
  jsonPostApi[OrderId, SendOrderChatMessageRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("chat")),
  )
