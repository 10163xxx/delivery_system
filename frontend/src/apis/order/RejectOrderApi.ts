import type {
  OrderId,
  RejectOrderRequest,
} from '@/objects/core/SharedObjects'
import { rejectOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(rejectOrderApiDefinition, orderId), payload)
}
