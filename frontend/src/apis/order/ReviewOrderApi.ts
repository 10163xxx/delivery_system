import type {
  OrderId,
  ReviewOrderRequest,
} from '@/objects/core/SharedObjects'
import { reviewOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(reviewOrderApiDefinition, orderId), payload)
}
