import type { DeliveryAppState, MenuItemId, StoreId, UpdateMenuItemStockRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath2, defineJsonPostApi2, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateMenuItemStockApiDefinition = defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemStockRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('menu')],
    [routeSegment('stock')],
  )

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
