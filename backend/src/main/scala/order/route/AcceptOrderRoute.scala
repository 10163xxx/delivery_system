package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.acceptOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val acceptOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(acceptOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(acceptOrderApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
      else acceptOrder(orderId).flatMap(handleStateResult)
    }
}
