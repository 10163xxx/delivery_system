import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemCategoryRequest,
} from '@/objects/core/SharedObjects'
import { updateMenuItemCategoryApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath2 } from '@/system/api/TypedApiDefinitions'

export function updateMenuItemCategory(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemCategoryRequest,
) {
  return postNormalizedDeliveryState(
    buildApiPath2(updateMenuItemCategoryApiDefinition, storeId, menuItemId),
    payload,
  )
}
