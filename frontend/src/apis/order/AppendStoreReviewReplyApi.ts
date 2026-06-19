// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { AppendStoreReviewReplyRequest, DeliveryAppState, OrderId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const appendStoreReviewReplyApiDefinition = defineJsonPostApi1<OrderId, AppendStoreReviewReplyRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('store-review-reply')],
  )

export function appendStoreReviewReply(
  orderId: OrderId,
  payload: AppendStoreReviewReplyRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(appendStoreReviewReplyApiDefinition, orderId), payload)
}
