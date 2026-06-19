package services.merchant.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.merchant.api.*

import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.WithdrawMerchantIncomeRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val withdrawMerchantIncomeRoute: HttpRoutes[IO] = apiRoute(withdrawMerchantIncomeApi) { matchedReq =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden(RouteMessages.WithdrawOtherMerchantIncomeForbidden)
    else
      matchedReq.as[WithdrawMerchantIncomeRequest].flatMap { payload =>
        withdrawMerchantIncome(user.displayName, payload).flatMap(handleStateResult)
      }
  }
}
