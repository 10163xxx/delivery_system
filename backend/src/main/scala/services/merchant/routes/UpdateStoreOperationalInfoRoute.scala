package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateStoreOperationalRequest
import domain.shared.{DeliveryAppState, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateStoreOperationalInfoRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi1(updateStoreOperationalInfoApi, req) =>
    val Some((matchedReq, storeId)) = extractApi1(updateStoreOperationalInfoApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantStoreForbidden)
      else
        matchedReq.as[UpdateStoreOperationalRequest].flatMap { payload =>
          updateStoreOperationalInfo(storeId, payload).flatMap(handleStateResult)
        }
    }
}
