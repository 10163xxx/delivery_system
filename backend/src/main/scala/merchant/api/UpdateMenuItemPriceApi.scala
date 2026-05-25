package merchant.api

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

val updateMenuItemPriceApi: FixedMethodApi2[StoreId, MenuItemId, DeliveryAppState] =
  jsonPostApi2[StoreId, MenuItemId, UpdateMenuItemPriceRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("price")),
  )
