import type { DeliveryAppState, OrderId, ReviewAppealRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const submitReviewAppealApiDefinition = defineJsonPostApi1<OrderId, ReviewAppealRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('review-appeals')],
  )

export function submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
  return postNormalizedDeliveryState(buildApiPath1(submitReviewAppealApiDefinition, orderId), payload)
}
