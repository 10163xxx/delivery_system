import type { DeliveryAppState, RefundRequestId, ResolvePartialRefundRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const resolvePartialRefundRequestApiDefinition = defineJsonPostApi1<RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('partial-refunds')],
    [routeSegment('review')],
  )

export function resolvePartialRefundRequest(
  refundId: RefundRequestId,
  payload: ResolvePartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolvePartialRefundRequestApiDefinition, refundId), payload)
}
