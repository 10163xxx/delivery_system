import type { OrderId } from '@/objects/core/SharedObjects'
import { readyOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function readyOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(readyOrderApiDefinition, orderId))
}
