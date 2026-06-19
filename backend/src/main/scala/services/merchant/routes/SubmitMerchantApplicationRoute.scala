package services.merchant.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.merchant.api.*

import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.MerchantRegistrationRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
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
