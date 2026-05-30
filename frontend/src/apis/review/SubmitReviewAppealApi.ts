import type {
  OrderId,
  ReviewAppealRequest,
} from '@/objects/core/SharedObjects'
import { submitReviewAppealApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
  return postNormalizedDeliveryState(buildApiPath1(submitReviewAppealApiDefinition, orderId), payload)
}
