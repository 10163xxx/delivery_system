package rider.route

import rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.UpdateRiderAvailabilityRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.updateRiderAvailability
import shared.api.routing.*
import shared.app.*

val updateRiderAvailabilityRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(updateRiderAvailabilityApi, req) =>
    val Some((matchedReq, riderId)) = extractApi1(updateRiderAvailabilityApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
      else
        matchedReq.as[UpdateRiderAvailabilityRequest].flatMap { payload =>
          updateRiderAvailability(riderId, payload).flatMap(handleStateResult)
        }
    }
}
