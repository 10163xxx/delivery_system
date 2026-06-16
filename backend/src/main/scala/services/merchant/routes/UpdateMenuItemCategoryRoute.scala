package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMenuItemCategoryRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val updateMenuItemCategoryRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(updateMenuItemCategoryApi, req) =>
    val (matchedReq, storeId, menuItemId) = requireApi2(updateMenuItemCategoryApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        matchedReq.as[UpdateMenuItemCategoryRequest].flatMap { payload =>
          updateMenuItemCategory(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }
}
