package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.pickupOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val pickupOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(pickupOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(pickupOrderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
      else pickupOrder(orderId).flatMap(handleStateResult)
    }
}
