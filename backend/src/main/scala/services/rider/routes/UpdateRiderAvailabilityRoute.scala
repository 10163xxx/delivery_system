package services.rider.routes

import services.rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderAvailabilityRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.rider.utils.updateRiderAvailability
import system.api.*
import system.app.*

val updateRiderAvailabilityRoute: HttpRoutes[IO] = apiRoute(updateRiderAvailabilityApi) { case (matchedReq, riderId) =>
  withRole(matchedReq, UserRole.rider) { user =>
    if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
    else
      matchedReq.as[UpdateRiderAvailabilityRequest].flatMap { payload =>
        updateRiderAvailability(riderId, payload).flatMap(handleStateResult)
      }
  }
}
