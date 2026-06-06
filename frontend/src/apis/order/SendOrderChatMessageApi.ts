import type {
  OrderId,
  SendOrderChatMessageRequest,
} from '@/objects/core/SharedObjects'
import { sendOrderChatMessageApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function sendOrderChatMessage(
  orderId: OrderId,
  payload: SendOrderChatMessageRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(sendOrderChatMessageApiDefinition, orderId), payload)
}
