import type {
  MenuItemId,
  StoreId,
} from '@/objects/core/SharedObjects'
import { removeMenuItemApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath2 } from '@/system/api/TypedApiDefinitions'

export function removeMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
  return postNormalizedDeliveryStateWithoutBody(
    buildApiPath2(removeMenuItemApiDefinition, storeId, menuItemId),
  )
}
