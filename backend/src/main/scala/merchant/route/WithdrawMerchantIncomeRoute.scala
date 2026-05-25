package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.WithdrawMerchantIncomeRequest
import domain.shared.{DeliveryAppState, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val withdrawMerchantIncomeRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(withdrawMerchantIncomeApi, req) =>
    val Some(matchedReq) = extractApi0(withdrawMerchantIncomeApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherMerchantIncomeForbidden)
      else
        matchedReq.as[WithdrawMerchantIncomeRequest].flatMap { payload =>
          withdrawMerchantIncome(user.displayName, payload).flatMap(handleStateResult)
        }
    }
}
