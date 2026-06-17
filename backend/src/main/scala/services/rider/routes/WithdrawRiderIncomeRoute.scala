package services.rider.routes

import services.rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.WithdrawRiderIncomeRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
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
