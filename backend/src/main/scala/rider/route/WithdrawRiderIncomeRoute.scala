package rider.route

import rider.api.*

import domain.shared.given

import cats.effect.IO
import domain.rider.WithdrawRiderIncomeRequest
import domain.shared.{DeliveryAppState, RiderId, UserRole}
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import rider.app.withdrawRiderIncome
import shared.api.routing.*
import shared.app.*

val withdrawRiderIncomeRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(withdrawRiderIncomeApi, req) =>
    val Some((matchedReq, riderId)) = extractApi1(withdrawRiderIncomeApi, req)
    withRole(matchedReq, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherRiderIncomeForbidden)
      else
        matchedReq.as[WithdrawRiderIncomeRequest].flatMap { payload =>
          withdrawRiderIncome(riderId, payload).flatMap(handleStateResult)
        }
    }
}
