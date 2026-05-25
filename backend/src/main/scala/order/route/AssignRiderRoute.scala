package order.route

import order.api.*

import domain.shared.given

import cats.effect.IO
import domain.order.AssignRiderRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import order.app.assignRider
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val assignRiderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(assignRiderApi, req) =>
    val Some((matchedReq, orderId)) = extractApi1(assignRiderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      matchedReq.as[AssignRiderRequest].flatMap { payload =>
        if !ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden(RouteMessages.ClaimOtherRiderOrderForbidden)
        else assignRider(orderId, payload).flatMap(handleStateResult)
      }
    }
}
