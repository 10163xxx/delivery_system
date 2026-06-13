import type { DeliveryAppState, OrderId, SubmitPartialRefundRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const submitPartialRefundRequestApiDefinition = defineJsonPostApi1<OrderId, SubmitPartialRefundRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('partial-refunds')],
  )

export function submitPartialRefundRequest(
  orderId: OrderId,
  payload: SubmitPartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitPartialRefundRequestApiDefinition, orderId), payload)
}
