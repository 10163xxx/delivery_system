package services.order.api

import domain.shared.given

import services.admin.utils.*
import cats.effect.IO
import domain.order.SubmitAfterSalesRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val submitAfterSalesRequestApi: FixedMethodApi1[OrderId, DeliveryAppState] =
  jsonPostApi1[OrderId, SubmitAfterSalesRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("orders")),
    List(routeSegment("afterSales")),
  )
