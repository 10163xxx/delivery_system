import type {
  RefundRequestId,
  ResolvePartialRefundRequest,
} from '@/objects/core/SharedObjects'
import { resolvePartialRefundRequestApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function resolvePartialRefundRequest(
  refundId: RefundRequestId,
  payload: ResolvePartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolvePartialRefundRequestApiDefinition, refundId), payload)
}
