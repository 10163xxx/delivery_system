import type { OrderSummary } from '@/shared/object/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  APPLICATION_STATUS,
  ORDER_STATUS,
  REVIEW_TARGET,
  ROUTE_PATH,
} from '@/shared/object/SharedObjects'
import {
  reviewOrder as reviewOrderRequest,
  submitAfterSalesRequest as submitAfterSalesRequestCall,
  submitPartialRefundRequest as submitPartialRefundRequestCall,
} from '@/shared/api/SharedApi'
import {
  buildAfterSalesPayload,
  buildPartialRefundPayload,
  buildReviewPayload,
  canReviewOrder,
  createInitialAfterSalesDraft,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatMaxPartialRefundQuantityMessage,
  hasPendingRiderReview,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'
import { clearDraftError, removeKey, setDraftError } from '@/customer/app/actions/CustomerActionHelpers'

type CustomerSupportParams = Pick<
  CustomerActionParams,
  | 'state'
  | 'partialRefundDrafts'
  | 'afterSalesDrafts'
  | 'reviewDrafts'
  | 'runAction'
  | 'navigate'
  | 'setPartialRefundErrors'
  | 'setPartialRefundDrafts'
  | 'setAfterSalesErrors'
  | 'setAfterSalesDrafts'
  | 'setReviewErrors'
  | 'setReviewDrafts'
>

type ReviewSubmissionValidationResult =
  | { ok: true; payload: ReturnType<typeof buildReviewPayload> }
  | { ok: false }

export function createCustomerSupportActions(params: CustomerSupportParams) {
  const {
    state,
    partialRefundDrafts,
    afterSalesDrafts,
    reviewDrafts,
    runAction,
    navigate,
    setPartialRefundErrors,
    setPartialRefundDrafts,
    setAfterSalesErrors,
    setAfterSalesDrafts,
    setReviewErrors,
    setReviewDrafts,
  } = params

  function getRemainingRefundableQuantity(order: OrderSummary, menuItemId: string) {
    const orderItem = order.items.find((item) => item.menuItemId === menuItemId)
    if (!orderItem) return 0

    const refundedQuantity =
      order.partialRefundRequests
        .filter((refund) => refund.menuItemId === menuItemId && refund.status === APPLICATION_STATUS.approved)
        .reduce((sum: number, refund) => sum + refund.quantity, 0)

    return Math.max(0, orderItem.quantity - refundedQuantity)
  }

  function canSubmitPartialRefund(order: OrderSummary) {
    const isRefundableOrder =
      order.status === ORDER_STATUS.pendingMerchantAcceptance ||
      order.status === ORDER_STATUS.preparing

    return (
      isRefundableOrder &&
      order.items.some((item) => getRemainingRefundableQuantity(order, item.menuItemId) > 0)
    )
  }

  function validateReviewSubmission(
    orderId: string,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ): ReviewSubmissionValidationResult {
    const draftKey = `${orderId}-${target}`
    const draft = reviewDrafts[draftKey] ?? createInitialReviewDraft()
    const payload = buildReviewPayload(target, draft)
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order || !canReviewOrder(order)) {
      setDraftError(setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.reviewOrderUnavailable)
      return { ok: false }
    }
    const submission = target === REVIEW_TARGET.store ? payload.storeReview : payload.riderReview
    if (!submission) return { ok: false }
    if (submission.rating < 5 && !submission.comment) {
      setDraftError(setReviewErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.lowRatingCommentRequired)
      return { ok: false }
    }
    return { ok: true, payload }
  }

  async function submitPartialRefundRequest(orderId: string, menuItemId: string) {
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const draftKey = `${orderId}-${menuItemId}`
    const remainingRefundableQuantity = getRemainingRefundableQuantity(order, menuItemId)
    if (remainingRefundableQuantity <= 0) {
      setDraftError(setPartialRefundErrors, draftKey, formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity))
      return
    }
    const payload = buildPartialRefundPayload(menuItemId, partialRefundDrafts[draftKey])
    if (!payload.reason) {
      setDraftError(setPartialRefundErrors, draftKey, DELIVERY_CONSOLE_MESSAGES.partialRefundReasonRequired)
      return
    }
    if (payload.quantity > remainingRefundableQuantity) {
      setDraftError(setPartialRefundErrors, draftKey, formatMaxPartialRefundQuantityMessage(remainingRefundableQuantity))
      return
    }
    const success = await runAction(() => submitPartialRefundRequestCall(orderId, payload))
    if (!success) return
    setPartialRefundDrafts((current) => removeKey(current, draftKey))
    clearDraftError(setPartialRefundErrors, draftKey)
  }

  async function submitAfterSalesRequest(orderId: string) {
    const payload = buildAfterSalesPayload(afterSalesDrafts[orderId] ?? createInitialAfterSalesDraft())
    if (!payload.reason) {
      setDraftError(setAfterSalesErrors, orderId, DELIVERY_CONSOLE_MESSAGES.afterSalesReasonRequired)
      return
    }
    if (
      payload.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest &&
      payload.expectedCompensationCents === undefined
    ) {
      setDraftError(setAfterSalesErrors, orderId, DELIVERY_CONSOLE_MESSAGES.expectedCompensationRequired)
      return
    }
    const success = await runAction(() => submitAfterSalesRequestCall(orderId, payload))
    if (!success) return
    setAfterSalesDrafts((current) => removeKey(current, orderId))
    clearDraftError(setAfterSalesErrors, orderId)
  }

  async function submitReview(
    orderId: string,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ) {
    const draftKey = `${orderId}-${target}`
    const order = state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validateReviewSubmission(orderId, target)
    if (!validation.ok) return

    const success = await runAction(() => reviewOrderRequest(orderId, validation.payload))
    if (!success) return

    setReviewDrafts((current) => removeKey(current, draftKey))
    clearDraftError(setReviewErrors, draftKey)

    const reviewCompleted = target === REVIEW_TARGET.store ? !hasPendingRiderReview(order) : true
    if (reviewCompleted) {
      navigate(ROUTE_PATH.customerOrders)
    }
  }

  return {
    getRemainingRefundableQuantity,
    canSubmitPartialRefund,
    submitPartialRefundRequest,
    submitAfterSalesRequest,
    submitReview,
  }
}
