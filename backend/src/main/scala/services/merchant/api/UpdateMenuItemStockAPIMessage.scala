package services.merchant.api

import domain.shared.given

import domain.merchant.UpdateMenuItemStockRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId}
import system.api.*

val updateMenuItemStockApi: FixedMethodApi[PathParams[StoreId, MenuItemId], DeliveryAppState] =
  jsonPostApi[StoreId, MenuItemId, UpdateMenuItemStockRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("stock")),
  )
