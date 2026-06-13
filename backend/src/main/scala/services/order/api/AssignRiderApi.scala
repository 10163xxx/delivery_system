package services.order.api

import domain.shared.given

import cats.effect.IO
import domain.order.AssignRiderRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.assignRider
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val assignRiderApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, AssignRiderRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("assign-rider")),
  )
