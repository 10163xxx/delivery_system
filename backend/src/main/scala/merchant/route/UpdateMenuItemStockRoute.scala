package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMenuItemStockRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val updateMenuItemStockRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(updateMenuItemStockApi, req) =>
    val Some((matchedReq, storeId, menuItemId)) = extractApi2(updateMenuItemStockApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        matchedReq.as[UpdateMenuItemStockRequest].flatMap { payload =>
          updateMenuItemStock(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }
}
