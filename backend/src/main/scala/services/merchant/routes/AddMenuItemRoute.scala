package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.AddMenuItemRequest
import domain.shared.{DeliveryAppState, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val addMenuItemRoute: HttpRoutes[IO] = apiRoute(addMenuItemApi) { case (matchedReq, storeId) =>
  withRole(matchedReq, UserRole.merchant) { user =>
    if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
    else
      matchedReq.as[AddMenuItemRequest].flatMap { payload =>
        addMenuItem(storeId, payload).flatMap(handleStateResult)
      }
  }
}
