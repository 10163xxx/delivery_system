import type {
  MenuItemId,
  StoreId,
  UpdateMenuItemPriceRequest,
} from '@/shared/object/core/SharedObjects'
import { updateMenuItemPriceApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath2 } from '@/shared/api/TypedApiDefinitions'

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
