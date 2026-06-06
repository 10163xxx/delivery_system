import type {
  OrderId,
  SubmitPartialRefundRequest,
} from '@/objects/core/SharedObjects'
import { submitPartialRefundRequestApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function submitPartialRefundRequest(
  orderId: OrderId,
  payload: SubmitPartialRefundRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(submitPartialRefundRequestApiDefinition, orderId), payload)
}
