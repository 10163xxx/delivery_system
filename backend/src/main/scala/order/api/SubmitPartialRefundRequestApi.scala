package order.api

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.SubmitPartialRefundRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val submitPartialRefundRequestApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, SubmitPartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("partial-refunds")),
  )
