// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, MenuItemId, StoreId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath2, defineJsonPostApi2, routeSegment } from '@/system/api/TypedApiDefinitions'

export const removeMenuItemApiDefinition = defineJsonPostApi2<StoreId, MenuItemId, void, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('menu')],
    [routeSegment('remove')],
  )

export function removeMenuItem(storeId: StoreId, menuItemId: MenuItemId) {
  return postNormalizedDeliveryStateWithoutBody(
    buildApiPath2(removeMenuItemApiDefinition, storeId, menuItemId),
  )
}
