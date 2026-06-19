package services.rider.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.rider.api.*

import system.objects.given

import cats.effect.IO
import services.rider.objects.apiTypes.WithdrawRiderIncomeRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.rider.objects.{RiderId}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import services.rider.utils.withdrawRiderIncome
import system.api.*
import system.app.*

val withdrawRiderIncomeRoute: HttpRoutes[IO] = apiRoute(withdrawRiderIncomeApi) { case (matchedReq, riderId) =>
  withRole(matchedReq, UserRole.rider) { user =>
    if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherRiderIncomeForbidden)
    else
      matchedReq.as[WithdrawRiderIncomeRequest].flatMap { payload =>
        withdrawRiderIncome(riderId, payload).flatMap(handleStateResult)
      }
  }
}
