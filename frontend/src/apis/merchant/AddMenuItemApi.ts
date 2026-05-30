import type {
  AddMenuItemRequest,
  StoreId,
} from '@/objects/core/SharedObjects'
import { addMenuItemApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function addMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addMenuItemApiDefinition, storeId), payload)
}
