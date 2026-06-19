// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AssignRiderRequest, DeliveryAppState, OrderId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const assignRiderApiDefinition = defineJsonPostApi1<OrderId, AssignRiderRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('assign-rider')],
  )

export function assignRider(orderId: OrderId, payload: AssignRiderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(assignRiderApiDefinition, orderId), payload)
}
