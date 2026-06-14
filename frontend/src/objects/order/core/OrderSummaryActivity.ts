import type { OrderPartialRefundRequest } from '@/objects/order/afterSales/OrderPartialRefundRequest'
import type { OrderChatMessage } from '@/objects/order/core/OrderChatMessage'
import type { OrderTimelineEntry } from '@/objects/order/core/OrderTimelineEntry'

export type OrderSummaryActivity = {
  timeline: OrderTimelineEntry[]
  chatMessages: OrderChatMessage[]
  partialRefundRequests: OrderPartialRefundRequest[]
}
