package order.api

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.SendOrderChatMessageRequest
import domain.shared.{ApprovalFlag, CustomerId, DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val sendOrderChatMessageApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, SendOrderChatMessageRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("chat")),
  )
