package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.deliverOrder
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val deliverOrderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(deliverOrderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(deliverOrderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsOrderAsRider(orderId, user.linkedProfileId) then Forbidden(RouteMessages.HandleOtherRiderOrderForbidden)
      else deliverOrder(orderId).flatMap(handleStateResult)
    }
}
