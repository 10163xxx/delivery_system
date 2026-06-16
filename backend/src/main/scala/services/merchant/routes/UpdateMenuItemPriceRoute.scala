package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMenuItemPriceRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateMenuItemPriceRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(updateMenuItemPriceApi, req) =>
    val (matchedReq, storeId, menuItemId) = requireApi2(updateMenuItemPriceApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        matchedReq.as[UpdateMenuItemPriceRequest].flatMap { payload =>
          updateMenuItemPrice(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }
}
