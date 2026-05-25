package order.api

import domain.shared.given

import cats.effect.IO
import domain.order.AppendStoreReviewReplyRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.appendStoreReviewReply
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val appendStoreReviewReplyApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, AppendStoreReviewReplyRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("store-review-reply")),
  )
