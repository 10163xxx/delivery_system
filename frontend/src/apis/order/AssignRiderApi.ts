import type {
  AssignRiderRequest,
  OrderId,
} from '@/objects/core/SharedObjects'
import { assignRiderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function assignRider(orderId: OrderId, payload: AssignRiderRequest) {
  return postNormalizedDeliveryState(buildApiPath1(assignRiderApiDefinition, orderId), payload)
}
