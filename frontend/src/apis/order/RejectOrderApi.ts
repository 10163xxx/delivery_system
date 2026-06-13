import type { DeliveryAppState, OrderId, RejectOrderRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const rejectOrderApiDefinition = defineJsonPostApi1<OrderId, RejectOrderRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('reject')],
  )

export function rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(rejectOrderApiDefinition, orderId), payload)
}
