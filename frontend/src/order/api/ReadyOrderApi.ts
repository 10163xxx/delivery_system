import type { OrderId } from '@/shared/object/core/SharedObjects'
import { readyOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function readyOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(readyOrderApiDefinition, orderId))
}
