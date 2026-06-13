package services.order.api

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.readyOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val readyOrderApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, Unit, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("ready")),
  )
