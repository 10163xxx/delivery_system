import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemStockRequest,
} from '@/shared/object/core/SharedObjects'
import { updateMenuItemStockApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath2 } from '@/shared/api/TypedApiDefinitions'

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
