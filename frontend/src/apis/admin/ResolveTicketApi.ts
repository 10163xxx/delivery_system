import type {
  OrderId,
  ResolveTicketRequest,
} from '@/objects/core/SharedObjects'
import { resolveTicketApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
  return postNormalizedDeliveryState(buildApiPath1(resolveTicketApiDefinition, orderId), payload)
}
