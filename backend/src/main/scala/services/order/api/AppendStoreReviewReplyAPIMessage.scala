package services.order.api

import domain.shared.given

import cats.effect.IO
import domain.order.AppendStoreReviewReplyRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.appendStoreReviewReply
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val appendStoreReviewReplyApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, AppendStoreReviewReplyRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("store-review-reply")),
  )
