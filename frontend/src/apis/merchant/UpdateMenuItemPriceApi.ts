// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, MenuItemId, StoreId, UpdateMenuItemPriceRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath2, defineJsonPostApi2, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateMenuItemPriceApiDefinition = defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemPriceRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('menu')],
    [routeSegment('price')],
  )

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
