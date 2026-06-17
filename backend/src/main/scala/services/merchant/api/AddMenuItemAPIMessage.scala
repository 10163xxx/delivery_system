package services.merchant.api

import domain.shared.given

import domain.merchant.AddMenuItemRequest
import domain.shared.{DeliveryAppState, StoreId}
import system.api.*

val addMenuItemApi: FixedMethodApi[PathParam[StoreId], DeliveryAppState] =
  jsonPostApi[StoreId, AddMenuItemRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
  )
