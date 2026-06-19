// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, OrderId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const pickupOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
  [routeSegment('pickup')],
)

export function pickupOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(pickupOrderApiDefinition, orderId))
}
