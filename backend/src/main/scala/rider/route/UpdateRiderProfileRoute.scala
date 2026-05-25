package rider.route

import rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderProfileRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.updateRiderProfile
import shared.api.routing.*
import shared.app.*

val updateRiderProfileRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(updateRiderProfileApi, req) =>
    val Some((matchedReq, riderId)) = extractApi1(updateRiderProfileApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
      else
        matchedReq.as[UpdateRiderProfileRequest].flatMap { payload =>
          updateRiderProfile(riderId, payload).flatMap(handleStateResult)
        }
    }
}
