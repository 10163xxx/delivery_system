package services.order.api

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.SendOrderChatMessageRequest
import domain.shared.{ApprovalFlag, CustomerId, DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val sendOrderChatMessageApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, SendOrderChatMessageRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("chat")),
  )
