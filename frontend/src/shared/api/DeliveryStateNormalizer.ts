import type { AdminTicket, AdminTicketResolution, AdminTicketSubmission } from '@/admin/object/after-sales/AdminTicket'
import type { Customer, CustomerMetrics } from '@/customer/object/profile/Customer'
import type { MerchantApplication, MerchantApplicationReview } from '@/merchant/object/application/MerchantApplication'
import type { Store, StoreMetrics, StoreOperations } from '@/merchant/object/store/Store'
import type {
  OrderPartialRefundRequest,
  OrderPartialRefundResolution,
} from '@/order/object/after-sales/OrderPartialRefundRequest'
import type {
  OrderSummary,
  OrderSummaryActivity,
  OrderSummaryFulfillment,
  OrderSummaryIdentity,
  OrderSummaryLifecycle,
  OrderSummaryPricing,
  OrderSummaryReviewContent,
  OrderSummaryReviewState,
} from '@/order/object/core/OrderSummary'
import type { ReviewAppeal, ReviewAppealReview } from '@/review/object/ReviewAppeal'
import type { Rider, RiderPayout, RiderPerformance } from '@/rider/object/profile/Rider'
import type { DeliveryAppState } from '@/shared/object/core/SharedObjects'
import type { DeliveryOrderState } from '@/shared/object/domain/DomainSlices'

function normalizeCustomerMetrics(customer: Customer): CustomerMetrics {
  return {
    revokedReviewCount: customer.revokedReviewCount,
    membershipTier: customer.membershipTier,
    monthlySpendCents: customer.monthlySpendCents,
    balanceCents: customer.balanceCents,
    coupons: customer.coupons,
  }
}

function normalizeStoreOperations(store: Store): StoreOperations {
  return {
    status: store.status,
    businessHours: store.businessHours,
    avgPrepMinutes: store.avgPrepMinutes,
    imageUrl: store.imageUrl,
    menu: store.menu.map((item) => ({
      ...item,
      selectionGroups: item.selectionGroups ?? [],
    })),
  }
}

function normalizeStoreMetrics(store: Store): StoreMetrics {
  return {
    averageRating: store.averageRating,
    ratingCount: store.ratingCount,
    oneStarRatingCount: store.oneStarRatingCount,
    revenueCents: store.revenueCents,
  }
}

function normalizeMerchantApplicationReview(application: MerchantApplication): MerchantApplicationReview {
  return {
    status: application.status,
    reviewNote: application.reviewNote,
    submittedAt: application.submittedAt,
    reviewedAt: application.reviewedAt,
  }
}

function normalizeReviewAppealReview(appeal: ReviewAppeal): ReviewAppealReview {
  return {
    status: appeal.status,
    resolutionNote: appeal.resolutionNote,
    submittedAt: appeal.submittedAt,
    reviewedAt: appeal.reviewedAt,
  }
}

function normalizeRiderPerformance(rider: Rider): RiderPerformance {
  return {
    averageRating: rider.averageRating,
    ratingCount: rider.ratingCount,
    oneStarRatingCount: rider.oneStarRatingCount,
    earningsCents: rider.earningsCents,
  }
}

function normalizeRiderPayout(rider: Rider): RiderPayout {
  return {
    payoutAccount: rider.payoutAccount,
    withdrawnCents: rider.withdrawnCents,
    availableToWithdrawCents: rider.availableToWithdrawCents,
    withdrawalHistory: rider.withdrawalHistory,
  }
}

function normalizeRefundResolution(refund: OrderPartialRefundRequest): OrderPartialRefundResolution {
  return {
    status: refund.status,
    resolutionNote: refund.resolutionNote,
    submittedAt: refund.submittedAt,
    reviewedAt: refund.reviewedAt,
  }
}

function normalizeOrderIdentity(order: OrderSummary): OrderSummaryIdentity {
  return {
    id: order.id,
    customerId: order.customerId,
    customerName: order.customerName,
    storeId: order.storeId,
    storeName: order.storeName,
    riderId: order.riderId,
    riderName: order.riderName,
  }
}

function normalizeOrderFulfillment(order: OrderSummary): OrderSummaryFulfillment {
  return {
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    scheduledDeliveryAt: order.scheduledDeliveryAt,
    remark: order.remark,
    items: order.items.map((item) => ({
      ...item,
      selections: item.selections ?? [],
    })),
  }
}

function normalizeOrderPricing(order: OrderSummary): OrderSummaryPricing {
  return {
    itemSubtotalCents: order.itemSubtotalCents,
    deliveryFeeCents: order.deliveryFeeCents,
    couponDiscountCents: order.couponDiscountCents,
    appliedCoupon: order.appliedCoupon,
    totalPriceCents: order.totalPriceCents,
  }
}

function normalizeOrderLifecycle(order: OrderSummary): OrderSummaryLifecycle {
  return {
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
}

function normalizeOrderReviewState(order: OrderSummary): OrderSummaryReviewState {
  return {
    storeRating: order.storeRating,
    riderRating: order.riderRating,
    merchantRejectReason: order.merchantRejectReason,
    reviewStatus: order.reviewStatus,
    reviewRevokedReason: order.reviewRevokedReason,
    reviewRevokedAt: order.reviewRevokedAt,
  }
}

function normalizeOrderReviewContent(order: OrderSummary): OrderSummaryReviewContent {
  return {
    reviewComment: order.reviewComment,
    reviewExtraNote: order.reviewExtraNote,
    storeReviewComment: order.storeReviewComment,
    storeReviewExtraNote: order.storeReviewExtraNote,
    storeMerchantReply: order.storeMerchantReply,
    storeMerchantReplyAt: order.storeMerchantReplyAt,
    riderReviewComment: order.riderReviewComment,
    riderReviewExtraNote: order.riderReviewExtraNote,
  }
}

function normalizeOrderActivity(order: OrderSummary): OrderSummaryActivity {
  return {
    timeline: order.timeline,
    chatMessages: order.chatMessages,
    partialRefundRequests: order.partialRefundRequests.map(normalizePartialRefundRequest),
  }
}

function normalizeTicketSubmission(ticket: AdminTicket): AdminTicketSubmission {
  return {
    requestType: ticket.requestType,
    submittedByRole: ticket.submittedByRole,
    submittedByName: ticket.submittedByName,
    expectedCompensationCents: ticket.expectedCompensationCents,
    submittedAt: ticket.submittedAt,
  }
}

function normalizeTicketResolution(ticket: AdminTicket): AdminTicketResolution {
  return {
    actualCompensationCents: ticket.actualCompensationCents,
    approved: ticket.approved,
    resolutionMode: ticket.resolutionMode,
    issuedCoupon: ticket.issuedCoupon,
    resolutionNote: ticket.resolutionNote,
    reviewedAt: ticket.reviewedAt,
  }
}

export function normalizePartialRefundRequest(refund: OrderPartialRefundRequest): OrderPartialRefundRequest {
  return {
    ...refund,
    resolution: normalizeRefundResolution(refund),
  }
}

export function normalizeOrderSummary(order: OrderSummary): OrderSummary {
  return {
    ...order,
    identity: normalizeOrderIdentity(order),
    fulfillment: normalizeOrderFulfillment(order),
    pricing: normalizeOrderPricing(order),
    lifecycle: normalizeOrderLifecycle(order),
    reviewState: normalizeOrderReviewState(order),
    reviewContent: normalizeOrderReviewContent(order),
    activity: normalizeOrderActivity(order),
  }
}

export function normalizeDeliveryState(state: DeliveryAppState): DeliveryAppState {
  const orders = state.orders.map(normalizeOrderSummary)
  const tickets = state.tickets.map((ticket) => ({
    ...ticket,
    submission: normalizeTicketSubmission(ticket),
    resolution: normalizeTicketResolution(ticket),
  }))
  const deliveryState: DeliveryOrderState = {
    orders,
    tickets,
    metrics: state.metrics,
  }

  return {
    ...state,
    customers: state.customers.map((customer) => ({
      ...customer,
      metrics: normalizeCustomerMetrics(customer),
    })),
    stores: state.stores.map((store) => ({
      ...store,
      operations: normalizeStoreOperations(store),
      metrics: normalizeStoreMetrics(store),
    })),
    riders: state.riders.map((rider) => ({
      ...rider,
      performance: normalizeRiderPerformance(rider),
      payout: normalizeRiderPayout(rider),
    })),
    merchantApplications: state.merchantApplications.map((application) => ({
      ...application,
      review: normalizeMerchantApplicationReview(application),
    })),
    reviewAppeals: state.reviewAppeals.map((appeal) => ({
      ...appeal,
      review: normalizeReviewAppealReview(appeal),
    })),
    orders,
    tickets,
    deliveryState,
  }
}
