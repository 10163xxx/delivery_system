import type {
  OrderId,
  SendOrderChatMessageRequest,
} from '@/shared/object/core/SharedObjects'
import { sendOrderChatMessageApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function sendOrderChatMessage(
  orderId: OrderId,
  payload: SendOrderChatMessageRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(sendOrderChatMessageApiDefinition, orderId), payload)
}
