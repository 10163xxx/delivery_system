import type {
  ResolveAfterSalesRequest,
  TicketId,
} from '@/shared/object/core/SharedObjects'
import { resolveAfterSalesTicketApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function resolveAfterSalesTicket(
  ticketId: TicketId,
  payload: ResolveAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveAfterSalesTicketApiDefinition, ticketId), payload)
}
