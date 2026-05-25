package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.readyOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val readyOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(readyOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(readyOrderApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
      else readyOrder(orderId).flatMap(handleStateResult)
    }
}
