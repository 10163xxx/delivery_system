package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.order.RejectOrderRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.rejectOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val rejectOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(rejectOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(rejectOrderApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsOrderAsMerchant(orderId, user.displayName) then Forbidden(RouteMessages.HandleOtherMerchantOrderForbidden)
      else
        matchedReq.as[RejectOrderRequest].flatMap { payload =>
          rejectOrder(orderId, payload).flatMap(handleStateResult)
        }
    }
}
