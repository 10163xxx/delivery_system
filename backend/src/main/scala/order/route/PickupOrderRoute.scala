package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.pickupOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val pickupOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(pickupOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(pickupOrderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
      else pickupOrder(orderId).flatMap(handleStateResult)
    }
}
