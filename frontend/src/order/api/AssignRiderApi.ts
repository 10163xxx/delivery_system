import type {
  AssignRiderRequest,
  OrderId,
} from '@/shared/object/core/SharedObjects'
import { assignRiderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function assignRider(orderId: OrderId, payload: AssignRiderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(assignRiderApiDefinition, orderId), payload)
}
