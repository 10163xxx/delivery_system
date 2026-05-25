import type {
  RefundRequestId,
  ResolvePartialRefundRequest,
} from '@/shared/object/core/SharedObjects'
import { resolvePartialRefundRequestApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function resolvePartialRefundRequest(
  refundId: RefundRequestId,
  payload: ResolvePartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolvePartialRefundRequestApiDefinition, refundId), payload)
}
