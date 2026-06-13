import type { DeliveryAppState, OrderId, ResolveTicketRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const resolveTicketApiDefinition = defineJsonPostApi1<OrderId, ResolveTicketRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('resolve')],
  )

export function resolveTicket(orderId: OrderId, payload: ResolveTicketRequest) {
  return postNormalizedDeliveryState(buildApiPath1(resolveTicketApiDefinition, orderId), payload)
}
