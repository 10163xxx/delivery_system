package services.admin.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.admin.api.*

import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.ReviewMerchantApplicationRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.merchant.objects.{MerchantApplicationId}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import system.api.*

val rejectMerchantApplicationRoute: HttpRoutes[IO] = apiRoute(rejectMerchantApplicationApi) { case (matchedReq, applicationId) =>
  withRole(matchedReq, UserRole.admin) { _ =>
    matchedReq.as[ReviewMerchantApplicationRequest].flatMap { payload =>
      rejectMerchantApplication(applicationId, payload).flatMap(handleStateResult)
    }
  }
}
