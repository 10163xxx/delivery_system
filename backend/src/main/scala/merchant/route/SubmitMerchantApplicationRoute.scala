package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.MerchantRegistrationRequest
import domain.shared.{DeliveryAppState, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val submitMerchantApplicationRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(submitMerchantApplicationApi, req) =>
    val Some(matchedReq) = extractApi0(submitMerchantApplicationApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      matchedReq.as[MerchantRegistrationRequest].flatMap { payload =>
        submitMerchantApplication(payload.copy(merchantName = user.displayName))
          .flatMap(handleStateResult)
      }
    }
}
