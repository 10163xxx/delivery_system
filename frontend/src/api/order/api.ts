import type {
  AssignRiderRequest,
  CreateOrderRequest,
  DeliveryAppState,
  OrderId,
  RejectOrderRequest,
  RefundRequestId,
  ResolveAfterSalesRequest,
  ResolvePartialRefundRequest,
  ReviewOrderRequest,
  SendOrderChatMessageRequest,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  TicketId,
} from '@/domain'
import { request } from '@/api/shared/http'

export function createOrder(payload: CreateOrderRequest) {
  return request<DeliveryAppState>('/api/delivery/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function acceptOrder(orderId: OrderId) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/accept`, {
    method: 'POST',
  })
}

export function rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function readyOrder(orderId: OrderId) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/ready`, {
    method: 'POST',
  })
}

export function assignRider(orderId: OrderId, payload: AssignRiderRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/assign-rider`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function pickupOrder(orderId: OrderId) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/pickup`, {
    method: 'POST',
  })
}

export function deliverOrder(orderId: OrderId) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/deliver`, {
    method: 'POST',
  })
}

export function reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function sendOrderChatMessage(orderId: OrderId, payload: SendOrderChatMessageRequest) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/chat`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitPartialRefundRequest(
  orderId: OrderId,
  payload: SubmitPartialRefundRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/partial-refunds`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolvePartialRefundRequest(
  refundId: RefundRequestId,
  payload: ResolvePartialRefundRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/partial-refunds/${refundId}/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveAfterSalesTicket(
  ticketId: TicketId,
  payload: ResolveAfterSalesRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/tickets/${ticketId}/after-sales/review`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitAfterSalesRequest(
  orderId: OrderId,
  payload: SubmitAfterSalesRequest,
) {
  return request<DeliveryAppState>(`/api/delivery/orders/${orderId}/after-sales`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
