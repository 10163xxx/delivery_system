import type {
  AppendStoreReviewReplyRequest,
  OrderId,
} from '@/objects/core/SharedObjects'
import { appendStoreReviewReplyApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function appendStoreReviewReply(
  orderId: OrderId,
  payload: AppendStoreReviewReplyRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(appendStoreReviewReplyApiDefinition, orderId), payload)
}
