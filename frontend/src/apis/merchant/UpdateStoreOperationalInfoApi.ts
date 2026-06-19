// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, StoreId, UpdateStoreOperationalRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateStoreOperationalInfoApiDefinition = defineJsonPostApi1<StoreId, UpdateStoreOperationalRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('operations')],
  )

export function updateStoreOperationalInfo(
  storeId: StoreId,
  payload: UpdateStoreOperationalRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateStoreOperationalInfoApiDefinition, storeId), payload)
}
