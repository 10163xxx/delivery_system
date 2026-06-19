package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.AddMenuItemRequest
import system.app.objects.{DeliveryAppState}
import services.merchant.objects.{StoreId}
import system.api.*

val addMenuItemApi: FixedMethodApi[PathParam[StoreId], DeliveryAppState] =
  jsonPostApi[StoreId, AddMenuItemRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("menu")),
  )
