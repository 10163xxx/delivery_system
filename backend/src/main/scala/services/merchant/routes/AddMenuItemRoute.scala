package services.merchant.routes

// Business note: route adapter for a typed API message; delegate business decisions to service actions instead of embedding them here.
import services.merchant.api.*

import system.objects.given

import cats.effect.IO
import services.merchant.objects.apiTypes.AddMenuItemRequest
import system.app.objects.{DeliveryAppState}
import services.auth.objects.{UserRole}
import services.merchant.objects.{StoreId}
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
