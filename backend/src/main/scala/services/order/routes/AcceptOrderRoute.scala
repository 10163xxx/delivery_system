package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.acceptOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val acceptOrderRoute: HttpRoutes[IO] = apiRoute(acceptOrderApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
    else acceptOrder(orderId).flatMap(handleStateResult)
  }
}
