// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { OrderPartialRefundRequest } from '@/objects/order/apiTypes/OrderPartialRefundRequest'
import type { OrderChatMessage } from '@/objects/order/core/OrderChatMessage'
import type { OrderTimelineEntry } from '@/objects/order/core/OrderTimelineEntry'

export type OrderSummaryActivity = {
  timeline: OrderTimelineEntry[]
  chatMessages: OrderChatMessage[]
  partialRefundRequests: OrderPartialRefundRequest[]
}
