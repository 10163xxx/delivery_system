package admin.route

import admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.ReviewMerchantApplicationRequest
import domain.shared.{DeliveryAppState, MerchantApplicationId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import shared.api.routing.*

val rejectMerchantApplicationRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(rejectMerchantApplicationApi, req) =>
    val Some((matchedReq, applicationId)) = extractApi1(rejectMerchantApplicationApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ReviewMerchantApplicationRequest].flatMap { payload =>
        rejectMerchantApplication(applicationId, payload).flatMap(handleStateResult)
      }
    }
}
