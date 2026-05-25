import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemCategoryRequest,
} from '@/shared/object/core/SharedObjects'
import { updateMenuItemCategoryApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath2 } from '@/shared/api/TypedApiDefinitions'

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
