// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, ResolveAfterSalesRequest, TicketId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const resolveAfterSalesTicketApiDefinition = defineJsonPostApi1<TicketId, ResolveAfterSalesRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('tickets')],
    [routeSegment('afterSales'), routeSegment('review')],
  )

export function resolveAfterSalesTicket(
  ticketId: TicketId,
  payload: ResolveAfterSalesRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveAfterSalesTicketApiDefinition, ticketId), payload)
}
