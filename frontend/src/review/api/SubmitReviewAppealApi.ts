import type {
  OrderId,
  ReviewAppealRequest,
} from '@/shared/object/core/SharedObjects'
import { submitReviewAppealApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function submitReviewAppeal(orderId: OrderId, payload: ReviewAppealRequest) {
  return postNormalizedDeliveryState(buildApiPath1(submitReviewAppealApiDefinition, orderId), payload)
}
