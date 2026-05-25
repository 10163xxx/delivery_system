import type { OrderId } from '@/shared/object/core/SharedObjects'
import { acceptOrderApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function acceptOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(acceptOrderApiDefinition, orderId))
}
