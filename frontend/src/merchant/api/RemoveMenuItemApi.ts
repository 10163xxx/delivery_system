import type {
  MenuItemId,
  StoreId,
} from '@/shared/object/core/SharedObjects'
import { removeMenuItemApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath2 } from '@/shared/api/TypedApiDefinitions'

export function removeMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
  return postNormalizedDeliveryStateWithoutBody(
    buildApiPath2(removeMenuItemApiDefinition, storeId, menuItemId),
  )
}
