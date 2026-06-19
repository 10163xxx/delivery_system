// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AddMenuItemRequest, DeliveryAppState, StoreId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const addMenuItemApiDefinition = defineJsonPostApi1<StoreId, AddMenuItemRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('menu')],
  )

export function addMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addMenuItemApiDefinition, storeId), payload)
}
