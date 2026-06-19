package services.merchant.api

// Business note: typed HTTP contract for this service operation; keep the matching frontend API client aligned by operation name.
import system.objects.given

import services.merchant.objects.apiTypes.UpdateStoreOperationalRequest
import system.app.objects.{DeliveryAppState}
import services.merchant.objects.{StoreId}
import system.api.*

val updateStoreOperationalInfoApi: FixedMethodApi[PathParam[StoreId], DeliveryAppState] =
  jsonPostApi[StoreId, UpdateStoreOperationalRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("operations")),
  )
