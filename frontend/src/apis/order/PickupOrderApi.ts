import type { OrderId } from '@/objects/core/SharedObjects'
import { pickupOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function pickupOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(pickupOrderApiDefinition, orderId))
}
