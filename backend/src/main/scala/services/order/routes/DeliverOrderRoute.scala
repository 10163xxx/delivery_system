package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.deliverOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val deliverOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(deliverOrderApi, req) =>
    val (matchedReq, orderId) = requireApi1(deliverOrderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
      else deliverOrder(orderId).flatMap(handleStateResult)
    }
}
