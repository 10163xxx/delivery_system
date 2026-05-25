import type {
  OrderId,
  ResolveTicketRequest,
} from '@/shared/object/core/SharedObjects'
import { resolveTicketApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
  return postNormalizedDeliveryState(buildApiPath1(resolveTicketApiDefinition, orderId), payload)
}
