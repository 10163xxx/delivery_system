package api.delivery

import domain.shared.given

import app.delivery.*
import cats.effect.IO
import domain.rider.{UpdateRiderProfileRequest, WithdrawRiderIncomeRequest}
import domain.shared.UserRole
import api.support.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*

val riderRoutes: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req @ POST -> Root / "api" / "delivery" / "riders" / riderId / "profile" =>
    withRole(req, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherRiderProfileForbidden)
      else
        req.as[UpdateRiderProfileRequest].flatMap { payload =>
          updateRiderProfile(riderId, payload).flatMap(handleStateResult)
        }
    }

  case req @ POST -> Root / "api" / "delivery" / "riders" / riderId / "withdraw" =>
    withRole(req, UserRole.rider) { user =>
      if !ownsRiderProfile(riderId, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherRiderIncomeForbidden)
      else
        req.as[WithdrawRiderIncomeRequest].flatMap { payload =>
          withdrawRiderIncome(riderId, payload).flatMap(handleStateResult)
        }
    }
}
