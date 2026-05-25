import type {
  OrderId,
  RejectOrderRequest,
} from '@/shared/object/core/SharedObjects'
import { rejectOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(rejectOrderApiDefinition, orderId), payload)
}
