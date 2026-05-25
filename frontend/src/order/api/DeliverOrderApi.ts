import type { OrderId } from '@/shared/object/core/SharedObjects'
import { deliverOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function deliverOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(deliverOrderApiDefinition, orderId))
}
