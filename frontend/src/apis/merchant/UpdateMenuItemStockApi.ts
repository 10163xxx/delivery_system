import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemStockRequest,
} from '@/objects/core/SharedObjects'
import { updateMenuItemStockApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath2 } from '@/system/api/TypedApiDefinitions'

export function updateMenuItemStock(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemStockRequest,
) {
  return postNormalizedDeliveryState(
    buildApiPath2(updateMenuItemStockApiDefinition, storeId, menuItemId),
    payload,
  )
}
