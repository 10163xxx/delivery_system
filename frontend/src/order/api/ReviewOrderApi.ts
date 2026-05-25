import type {
  OrderId,
  ReviewOrderRequest,
} from '@/shared/object/core/SharedObjects'
import { reviewOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(reviewOrderApiDefinition, orderId), payload)
}
