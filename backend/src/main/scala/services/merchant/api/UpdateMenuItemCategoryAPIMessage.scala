package services.merchant.api

import domain.shared.given

import domain.merchant.UpdateMenuItemCategoryRequest
import domain.shared.{DeliveryAppState, MenuItemId, StoreId}
import system.api.*

val updateMenuItemCategoryApi: FixedMethodApi[PathParams[StoreId, MenuItemId], DeliveryAppState] =
  jsonPostApi[StoreId, MenuItemId, UpdateMenuItemCategoryRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("category")),
  )
