package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.MerchantRegistrationRequest
import domain.shared.{DeliveryAppState, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val submitMerchantApplicationRoute: HttpRoutes[IO] = apiRoute(submitMerchantApplicationApi) { matchedReq =>
  withRole(matchedReq, UserRole.merchant) { user =>
    matchedReq.as[MerchantRegistrationRequest].flatMap { payload =>
      submitMerchantApplication(payload.copy(merchantName = user.displayName))
        .flatMap(handleStateResult)
    }
  }
}
