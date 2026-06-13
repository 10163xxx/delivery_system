import type { DeliveryAppState, OrderId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const acceptOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
  [routeSegment('accept')],
)

export function acceptOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(acceptOrderApiDefinition, orderId))
}
