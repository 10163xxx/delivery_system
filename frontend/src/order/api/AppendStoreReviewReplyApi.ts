import type {
  AppendStoreReviewReplyRequest,
  OrderId,
} from '@/shared/object/core/SharedObjects'
import { appendStoreReviewReplyApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function appendStoreReviewReply(
  orderId: OrderId,
  payload: AppendStoreReviewReplyRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(appendStoreReviewReplyApiDefinition, orderId), payload)
}
