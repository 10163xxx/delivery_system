import type {
  AddMenuItemRequest,
  StoreId,
} from '@/shared/object/core/SharedObjects'
import { addMenuItemApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function addMenuItem(storeId: StoreId, payload: AddMenuItemRequest) {
  return postNormalizedDeliveryState(buildApiPath1(addMenuItemApiDefinition, storeId), payload)
}
