package merchant.api

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

val updateMenuItemStockApi: FixedMethodApi2[StoreId, MenuItemId, DeliveryAppState] =
  jsonPostApi2[StoreId, MenuItemId, UpdateMenuItemStockRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("stock")),
  )
