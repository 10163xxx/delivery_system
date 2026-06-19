// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, OrderId, ReviewOrderRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const reviewOrderApiDefinition = defineJsonPostApi1<OrderId, ReviewOrderRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('review')],
  )

export function reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(reviewOrderApiDefinition, orderId), payload)
}
