package services.rider.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.rider.api.*

import system.objects.given

import cats.effect.IO
import services.rider.objects.apiTypes.UpdateRiderProfileRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.rider.objects.{RiderId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.rider.utils.updateRiderProfile
import system.api.*
import system.app.*

val updateRiderProfileRoute: HttpRoutes[IO] = apiRoute(updateRiderProfileApi) { case (matchedReq, riderId) =>
  withRole(matchedReq, UserRole.rider) { user =>
    if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
    else
      matchedReq.as[UpdateRiderProfileRequest].flatMap { payload =>
        updateRiderProfile(riderId, payload).flatMap(handleStateResult)
      }
  }
}
