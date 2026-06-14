package services.admin.api

import domain.shared.given

import cats.effect.IO
import domain.admin.ResolveTicketRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.review.utils.*
import system.api.*

val resolveTicketApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, ResolveTicketRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("resolve")),
  )
