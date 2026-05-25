package order.api

import domain.shared.given

import cats.effect.IO
import domain.order.CreateOrderRequest
import domain.shared.{DeliveryAppState, UserRole}
import order.app.createOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val createOrderApi: FixedMethodApi0[DeliveryAppState] =
  jsonPostApi0[CreateOrderRequest, DeliveryAppState](
    routeSegment("api"),
    routeSegment("delivery"),
    routeSegment("orders"),
  )
