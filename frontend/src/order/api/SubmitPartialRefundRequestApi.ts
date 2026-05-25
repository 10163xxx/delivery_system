import type {
  OrderId,
  SubmitPartialRefundRequest,
} from '@/shared/object/core/SharedObjects'
import { submitPartialRefundRequestApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function submitPartialRefundRequest(
  orderId: OrderId,
  payload: SubmitPartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitPartialRefundRequestApiDefinition, orderId), payload)
}
