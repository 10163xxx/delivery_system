package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMenuItemCategoryRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val updateMenuItemCategoryRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(updateMenuItemCategoryApi, req) =>
    val Some((matchedReq, storeId, menuItemId)) = extractApi2(updateMenuItemCategoryApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        matchedReq.as[UpdateMenuItemCategoryRequest].flatMap { payload =>
          updateMenuItemCategory(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }
}
