package services.merchant.routes

import services.merchant.api.*

import domain.shared.given

import cats.effect.IO
import domain.shared.{DeliveryAppState, MenuItemId, StoreId, UserRole}
import services.merchant.utils.*
import org.http4s.HttpRoutes
import org.http4s.circe.CirceEntityEncoder.*
import org.http4s.dsl.io.*
import system.api.*
import system.app.*

val removeMenuItemRoute: HttpRoutes[IO] = HttpRoutes.of[IO] {
  case req if matchesApi2(removeMenuItemApi, req) =>
    val Some((matchedReq, storeId, menuItemId)) = extractApi2(removeMenuItemApi, req)
    withRole(matchedReq, UserRole.merchant) { user =>
      if !ownsStore(storeId, user.displayName) then Forbidden(RouteMessages.ModifyOtherMerchantMenuForbidden)
      else removeMenuItem(storeId, menuItemId).flatMap(handleStateResult)
    }
}
