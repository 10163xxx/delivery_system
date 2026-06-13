import type { DeliveryAppState, MenuItemId, StoreId, UpdateMenuItemCategoryRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath2, defineJsonPostApi2, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateMenuItemCategoryApiDefinition = defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemCategoryRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('stores')],
    [routeSegment('menu')],
    [routeSegment('category')],
  )

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
