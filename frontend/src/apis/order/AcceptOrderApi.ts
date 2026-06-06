import type { OrderId } from '@/objects/core/SharedObjects'
import { acceptOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function acceptOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(acceptOrderApiDefinition, orderId))
}
