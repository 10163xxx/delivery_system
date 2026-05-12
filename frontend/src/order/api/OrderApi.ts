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
} from '@/shared/object/core/SharedObjects'
import {
  defineJsonPostEndpoint,
  httpClient,
} from '@/shared/api/SharedHttpClient'
import { normalizeDeliveryState } from '@/shared/api/DeliveryStateNormalizer'
import {
  DELIVERY_ORDERS_API_ROUTE,
  getAfterSalesReviewApiRoute,
  getOrderAcceptApiRoute,
  getOrderAfterSalesApiRoute,
  getOrderAssignRiderApiRoute,
  getOrderChatApiRoute,
  getOrderDeliverApiRoute,
  getOrderPartialRefundsApiRoute,
  getOrderPickupApiRoute,
  getOrderReadyApiRoute,
  getOrderRejectApiRoute,
  getOrderReviewApiRoute,
  getPartialRefundReviewApiRoute,
} from '@/shared/api/ApiRoutes'

export const orderApi = {
  createOrder(payload: CreateOrderRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<CreateOrderRequest, DeliveryAppState>(DELIVERY_ORDERS_API_ROUTE),
      payload,
    ).then(normalizeDeliveryState)
  },
  acceptOrder(orderId: OrderId) {
    return httpClient.postWithoutBody(
      defineJsonPostEndpoint<void, DeliveryAppState>(getOrderAcceptApiRoute(orderId)),
    ).then(normalizeDeliveryState)
  },
  rejectOrder(orderId: OrderId, payload: RejectOrderRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<RejectOrderRequest, DeliveryAppState>(getOrderRejectApiRoute(orderId)),
      payload,
    ).then(normalizeDeliveryState)
  },
  readyOrder(orderId: OrderId) {
    return httpClient.postWithoutBody(
      defineJsonPostEndpoint<void, DeliveryAppState>(getOrderReadyApiRoute(orderId)),
    ).then(normalizeDeliveryState)
  },
  assignRider(orderId: OrderId, payload: AssignRiderRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<AssignRiderRequest, DeliveryAppState>(
        getOrderAssignRiderApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  pickupOrder(orderId: OrderId) {
    return httpClient.postWithoutBody(
      defineJsonPostEndpoint<void, DeliveryAppState>(getOrderPickupApiRoute(orderId)),
    ).then(normalizeDeliveryState)
  },
  deliverOrder(orderId: OrderId) {
    return httpClient.postWithoutBody(
      defineJsonPostEndpoint<void, DeliveryAppState>(getOrderDeliverApiRoute(orderId)),
    ).then(normalizeDeliveryState)
  },
  reviewOrder(orderId: OrderId, payload: ReviewOrderRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ReviewOrderRequest, DeliveryAppState>(getOrderReviewApiRoute(orderId)),
      payload,
    ).then(normalizeDeliveryState)
  },
  sendOrderChatMessage(orderId: OrderId, payload: SendOrderChatMessageRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<SendOrderChatMessageRequest, DeliveryAppState>(
        getOrderChatApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  submitPartialRefundRequest(orderId: OrderId, payload: SubmitPartialRefundRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<SubmitPartialRefundRequest, DeliveryAppState>(
        getOrderPartialRefundsApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  resolvePartialRefundRequest(refundId: RefundRequestId, payload: ResolvePartialRefundRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ResolvePartialRefundRequest, DeliveryAppState>(
        getPartialRefundReviewApiRoute(refundId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  resolveAfterSalesTicket(ticketId: TicketId, payload: ResolveAfterSalesRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<ResolveAfterSalesRequest, DeliveryAppState>(
        getAfterSalesReviewApiRoute(ticketId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
  submitAfterSalesRequest(orderId: OrderId, payload: SubmitAfterSalesRequest) {
    return httpClient.postJson(
      defineJsonPostEndpoint<SubmitAfterSalesRequest, DeliveryAppState>(
        getOrderAfterSalesApiRoute(orderId),
      ),
      payload,
    ).then(normalizeDeliveryState)
  },
}

export const {
  createOrder,
  acceptOrder,
  rejectOrder,
  readyOrder,
  assignRider,
  pickupOrder,
  deliverOrder,
  reviewOrder,
  sendOrderChatMessage,
  submitPartialRefundRequest,
  resolvePartialRefundRequest,
  resolveAfterSalesTicket,
  submitAfterSalesRequest,
} = orderApi
