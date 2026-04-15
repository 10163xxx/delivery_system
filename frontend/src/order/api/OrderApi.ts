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
} from '@/shared/object/SharedObjects'
import { request } from '@/shared/api/SharedHttpClient'
import { DELIVERY_API_ROUTE } from '@/shared/api/ApiRoutes'

export function createOrder(payload: CreateOrderRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orders, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function acceptOrder(orderId: OrderId) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderAccept(orderId), {
    method: 'POST',
  })
}

export function rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderReject(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function readyOrder(orderId: OrderId) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderReady(orderId), {
    method: 'POST',
  })
}

export function assignRider(orderId: OrderId, payload: AssignRiderRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderAssignRider(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function pickupOrder(orderId: OrderId) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderPickup(orderId), {
    method: 'POST',
  })
}

export function deliverOrder(orderId: OrderId) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderDeliver(orderId), {
    method: 'POST',
  })
}

export function reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderReview(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function sendOrderChatMessage(orderId: OrderId, payload: SendOrderChatMessageRequest) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderChat(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitPartialRefundRequest(
  orderId: OrderId,
  payload: SubmitPartialRefundRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderPartialRefunds(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolvePartialRefundRequest(
  refundId: RefundRequestId,
  payload: ResolvePartialRefundRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.partialRefundReview(refundId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function resolveAfterSalesTicket(
  ticketId: TicketId,
  payload: ResolveAfterSalesRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.afterSalesReview(ticketId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function submitAfterSalesRequest(
  orderId: OrderId,
  payload: SubmitAfterSalesRequest,
) {
  return request<DeliveryAppState>(DELIVERY_API_ROUTE.orderAfterSales(orderId), {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
