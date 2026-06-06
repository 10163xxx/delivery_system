import type {
  ResolveAfterSalesRequest,
  TicketId,
} from '@/objects/core/SharedObjects'
import { resolveAfterSalesTicketApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function resolveAfterSalesTicket(
  ticketId: TicketId,
  payload: ResolveAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveAfterSalesTicketApiDefinition, ticketId), payload)
}
