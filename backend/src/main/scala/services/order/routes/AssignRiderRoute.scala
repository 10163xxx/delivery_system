package services.order.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.order.api.*

import system.objects.given

import cats.effect.IO
import services.order.objects.apiTypes.AssignRiderRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.order.objects.{OrderId}
import services.order.utils.assignRider
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val assignRiderRoute: HttpRoutes[IO] = apiRoute(assignRiderApi) { case (matchedReq, orderId) =>
  withRole(matchedReq, UserRole.rider) { user =>
    matchedReq.as[AssignRiderRequest].flatMap { payload =>
      if !ownsRiderProfile(payload.riderId, user.linkedProfileId) then Forbidden(RouteMessages.ClaimOtherRiderOrderForbidden)
      else assignRider(orderId, payload).flatMap(handleStateResult)
    }
  }
}
