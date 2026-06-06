import type { OrderId } from '@/objects/core/SharedObjects'
import { deliverOrderApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryStateWithoutBody } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function deliverOrder(orderId: OrderId) {
  return postNormalizedDeliveryStateWithoutBody(buildApiPath1(deliverOrderApiDefinition, orderId))
}
