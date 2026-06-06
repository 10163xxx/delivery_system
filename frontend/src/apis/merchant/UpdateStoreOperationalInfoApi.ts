import type {
  StoreId,
  UpdateStoreOperationalRequest,
} from '@/objects/core/SharedObjects'
import { updateStoreOperationalInfoApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function updateStoreOperationalInfo(
  storeId: StoreId,
  payload: UpdateStoreOperationalRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateStoreOperationalInfoApiDefinition, storeId), payload)
}
