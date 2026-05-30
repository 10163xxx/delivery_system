import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemPriceRequest,
} from '@/objects/core/SharedObjects'
import { updateMenuItemPriceApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath2 } from '@/system/api/TypedApiDefinitions'

export function updateMenuItemPrice(
  storeId: StoreId,
  menuItemId: MenuItemId,
  payload: UpdateMenuItemPriceRequest,
) {
  return postNormalizedDeliveryState(
    buildApiPath2(updateMenuItemPriceApiDefinition, storeId, menuItemId),
    payload,
  )
}
