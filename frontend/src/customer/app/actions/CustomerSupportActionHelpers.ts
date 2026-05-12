import type { OrderSummary } from '@/shared/object/core/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_TARGET,
} from '@/shared/object/core/SharedObjects'
import {
  buildAfterSalesPayload,
  buildPartialRefundPayload,
  buildReviewPayload,
  canReviewOrder,
  createInitialAfterSalesDraft,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatMaxPartialRefundQuantityMessage,
  LOW_RATING_MAX,
} from '@/shared/delivery/DeliveryServices'
import type {
  CustomerSupportParams,
  ReviewSubmissionValidationResult,
} from '@/customer/object/action/CustomerActionObjects'
import { setDraftError } from '@/customer/app/actions/CustomerActionHelpers'

export function getRemainingRefundableQuantity(order: OrderSummary, menuItemId: string) {
  const orderItem = order.items.find((item) => item.menuItemId === menuItemId)
  if (!orderItem) return 0

  const refundedQuantity =
    order.partialRefundRequests
      .filter((refund) => refund.menuItemId === menuItemId && refund.status === APPLICATION_STATUS.approved)
      .reduce((sum: number, refund) => sum + refund.quantity, 0)

  return Math.max(0, orderItem.quantity - refundedQuantity)
}

export function canSubmitPartialRefund(order: OrderSummary) {
  const isRefundableOrder =
    order.status === ORDER_STATUS.pendingMerchantAcceptance ||
    order.status === ORDER_STATUS.preparing

  return (
    isRefundableOrder &&
    order.items.some((item) => getRemainingRefundableQuantity(order, item.menuItemId) > 0)
  )
}

export function validateCustomerReviewSubmission(
  params: CustomerSupportParams,
  orderId: string,
  target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
): ReviewSubmissionValidationResult {
  const draftKey = `${orderId}-${target}`
  const draft = params.reviewDrafts[draftKey] ?? createInitialReviewDraft()
  const payload = buildReviewPayload(target, draft)
  const order = params.state?.orders.find((entry) => entry.id === orderId)
  if (!order || !canReviewOrder(order)) {
    setDraftError(params.setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.review.reviewOrderUnavailable)
    return { ok: false }
  }
  const submission = target === REVIEW_TARGET.store ? payload.storeReview : payload.riderReview
  if (!submission) return { ok: false }
  if (submission.rating <= LOW_RATING_MAX && !submission.comment) {
    setDraftError(params.setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.review.lowRatingCommentRequired)
    return { ok: false }
  }
  return { ok: true, payload }
}

export function validatePartialRefundDraft(params: CustomerSupportParams, order: OrderSummary, menuItemId: string) {
  const draftKey = `${order.id}-${menuItemId}`
  const remainingRefundableQuantity = getRemainingRefundableQuantity(order, menuItemId)
  if (remainingRefundableQuantity <= 0) {
    setDraftError(params.setPartialRefundErrors, draftKey, formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity))
    return null
  }
  const payload = buildPartialRefundPayload(menuItemId, params.partialRefundDrafts[draftKey])
  if (!payload.reason) {
    setDraftError(params.setPartialRefundErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.order.partialRefundReasonRequired)
    return null
  }
  if (payload.quantity > remainingRefundableQuantity) {
    setDraftError(params.setPartialRefundErrors, draftKey, formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity))
    return null
  }
  return { draftKey, payload }
}

export function validateAfterSalesDraft(params: CustomerSupportParams, orderId: string) {
  const payload = buildAfterSalesPayload(params.afterSalesDrafts[orderId] ?? createInitialAfterSalesDraft())
  if (!payload.reason) {
    setDraftError(params.setAfterSalesErrors, orderId, DELIVERY_CONSOLE_MESSAGES.order.afterSalesReasonRequired)
    return null
  }
  if (
    payload.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest &&
    payload.expectedCompensationCents === undefined
  ) {
    setDraftError(params.setAfterSalesErrors, orderId, DELIVERY_CONSOLE_MESSAGES.order.expectedCompensationRequired)
    return null
  }
  return payload
}
