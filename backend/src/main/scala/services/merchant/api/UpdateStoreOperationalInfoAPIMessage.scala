package services.merchant.api

import domain.shared.given

import domain.merchant.UpdateStoreOperationalRequest
import domain.shared.{DeliveryAppState, StoreId}
import system.api.*

val updateStoreOperationalInfoApi: FixedMethodApi[PathParam[StoreId], DeliveryAppState] =
  jsonPostApi[StoreId, UpdateStoreOperationalRequest, DeliveryAppState](
    List(routeSegment("api"), routeSegment("delivery"), routeSegment("stores")),
    List(routeSegment("operations")),
  )
