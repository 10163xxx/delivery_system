package services.merchant.api

import domain.shared.given

import domain.merchant.UpdateMenuItemPriceRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId}
import system.api.*

val updateMenuItemPriceApi: FixedMethodApi[PathParams[StoreId, MenuItemId], DeliveryAppState] =
  jsonPostApi[StoreId, MenuItemId, UpdateMenuItemPriceRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("price")),
  )
