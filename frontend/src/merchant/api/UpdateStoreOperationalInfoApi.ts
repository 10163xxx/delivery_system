import type {
  StoreId,
  UpdateStoreOperationalRequest,
} from '@/shared/object/core/SharedObjects'
import { updateStoreOperationalInfoApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function updateStoreOperationalInfo(
  storeId: StoreId,
  payload: UpdateStoreOperationalRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(updateStoreOperationalInfoApiDefinition, storeId), payload)
}
