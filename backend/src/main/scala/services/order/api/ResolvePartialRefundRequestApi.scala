package services.order.api

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.ResolvePartialRefundRequest
import domain.shared.{DeliveryAppState, RefundRequestId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val resolvePartialRefundRequestApi: FixedMethodApi1[RefundRequestId, DeliveryAppState] =
  jsonPostApi1[RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("partial-refunds")),
    List(routeSegment("review")),
  )
