import type { DeliveryAppState, OrderId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const readyOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
  [routeSegment('ready')],
)

export function readyOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(readyOrderApiDefinition, orderId))
}
