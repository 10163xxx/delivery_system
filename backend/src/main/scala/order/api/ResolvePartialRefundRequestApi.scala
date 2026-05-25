package order.api

import domain.shared.given

import admin.app.*
import cats.effect.IO
import domain.order.ResolvePartialRefundRequest
import domain.shared.{DeliveryAppState, RefundRequestId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val resolvePartialRefundRequestApi: FixedMethodApi1[RefundRequestId, DeliveryAppState] =
  jsonPostApi1[RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("partial-refunds")),
    List(routeSegment("review")),
  )
