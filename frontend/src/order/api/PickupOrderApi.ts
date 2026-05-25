import type { OrderId } from '@/shared/object/core/SharedObjects'
import { pickupOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function pickupOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(pickupOrderApiDefinition, orderId))
}
