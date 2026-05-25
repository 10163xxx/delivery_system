package merchant.route

import merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.merchant.UpdateMenuItemPriceRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import merchant.app.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityCodec.*
import org.http4s.dsl.io.*
import shared.api.routing.*
import shared.app.*

val updateMenuItemPriceRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(updateMenuItemPriceApi, req) =>
    val Some((matchedReq, storeId, menuItemId)) = extractApi2(updateMenuItemPriceApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else
        matchedReq.as[UpdateMenuItemPriceRequest].flatMap { payload =>
          updateMenuItemPrice(storeId, menuItemId, payload).flatMap(handleStateResult)
        }
    }
}
