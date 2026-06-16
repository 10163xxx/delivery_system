package services.admin.routes

import services.admin.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.ReviewMerchantApplicationRequest
import domain.shared.{DeliveryAppState, MerchantApplicationId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val approveMerchantApplicationRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(approveMerchantApplicationApi, req) =>
    val (matchedReq, applicationId) = requireApi1(approveMerchantApplicationApi, req)
    withRole(matchedReq, UserRole.admin) { _ =>
      matchedReq.as[ReviewMerchantApplicationRequest].flatMap { payload =>
        approveMerchantApplication(applicationId, payload).flatMap(handleStateResult)
      }
    }
}
