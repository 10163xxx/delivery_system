package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import system.app.objects.{DeliveryAppState}
import services.merchant.objects.{MenuItemId, StoreId}
import system.api.*

val removeMenuItemApi: FixedMethodApi[PathParams[StoreId, MenuItemId], DeliveryAppState] =
  jsonPostApi[StoreId, MenuItemId, Unit, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
    List(routeSegment("remove")),
  )
