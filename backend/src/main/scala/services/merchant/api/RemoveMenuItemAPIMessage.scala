package services.merchant.api

import domain.shared.given

import domain.shared.{DeliveryAppState, MenuItemId, StoreId}
import system.api.*

val removeMenuItemApi: FixedMethodApi[PathParams[StoreId, MenuItemId], DeliveryAppState] =
  jsonPostApi[StoreId, MenuItemId, Unit, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("remove")),
  )
