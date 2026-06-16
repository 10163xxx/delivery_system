package services.order.routes

import services.order.api.*

import domain.shared.given

import cats.effect.IO
import domain.order.AssignRiderRequest
import domain.shared.{DeliveryAppState, OrderId, UserRole}
import services.order.utils.assignRider
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val assignRiderRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(assignRiderApi, req) =>
    val (matchedReq, orderId) = requireApi1(assignRiderApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      matchedReq.as[AssignRiderRequest].flatMap { payload =>
        if !ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden(RouteMessages.ClaimOtherRiderOrderForbidden)
        else assignRider(orderId, payload).flatMap(handleStateResult)
      }
    }
}
