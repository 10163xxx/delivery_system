package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMerchantProfileRequest
import domain.shared.{DeliveryAppState, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateMerchantProfileRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi0(updateMerchantProfileApi, req) =>
    val Some(matchedReq) = extractApi0(updateMerchantProfileApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsMerchantProfile(user.displayName, user.linkedProfileId) then Forbidden(RouteMessages.ModifyOtherMerchantProfileForbidden)
      else
        matchedReq.as[UpdateMerchantProfileRequest].flatMap { payload =>
          updateMerchantProfile(user.displayName, payload).flatMap(handleStateResult)
        }
    }
}
