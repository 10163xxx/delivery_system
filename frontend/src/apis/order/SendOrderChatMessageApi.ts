import type { DeliveryAppState, OrderId, SendOrderChatMessageRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const sendOrderChatMessageApiDefinition = defineJsonPostApi1<OrderId, SendOrderChatMessageRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('orders')],
    [routeSegment('chat')],
  )

export function sendOrderChatMessage(
  orderId: OrderId,
  payload: SendOrderChatMessageRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(sendOrderChatMessageApiDefinition, orderId), payload)
}
