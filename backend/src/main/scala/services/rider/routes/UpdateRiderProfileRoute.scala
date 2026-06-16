package services.rider.routes

import services.rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderProfileRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.rider.utils.updateRiderProfile
import system.api.*
import system.app.*

val updateRiderProfileRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(updateRiderProfileApi, req) =>
    val (matchedReq, riderId) = requireApi1(updateRiderProfileApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
      else
        matchedReq.as[UpdateRiderProfileRequest].flatMap { payload =>
          updateRiderProfile(riderId, payload).flatMap(handleStateResult)
        }
    }
}
