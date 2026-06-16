import { ROUTE_PATH, type MenuItemId, type OrderId } from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'
import { buildReviewDraftKey } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import {
  reviewOrder,
  submitAfterSalesRequest as submitAfterSalesRequestApi,
  submitPartialRefundRequest as submitPartialRefundRequestApi,
} from '@/system/api/SharedApi'
import { hasPendingRiderReview } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import type {
  CustomerOrderIssueParams,
} from '@/pages/CustomerConsole/objects/CustomerActionObjects'
import { clearDraftError, removeKey } from '@/pages/CustomerConsole/functions/actions/common/CustomerActionHelpers'
import {
  canSubmitPartialRefund,
  getRemainingRefundableQuantity,
  validateAfterSalesDraft,
  validateCustomerReviewSubmission,
  validatePartialRefundDraft,
} from '@/pages/CustomerConsole/functions/actions/orderIssue/CustomerOrderIssueValidators'

export function createCustomerOrderIssueActions(params: CustomerOrderIssueParams) {
  async function submitPartialRefundRequest(orderId: OrderId, menuItemId: MenuItemId) {
    const order = params.state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validatePartialRefundDraft(params, order, menuItemId)
    if (!validation) return
    const success = await params.runAction(() =>
      submitPartialRefundRequestApi(orderId, validation.payload),
    )
    if (!success) return
    params.setPartialRefundDrafts((current) => removeKey(current, validation.draftKey))
    clearDraftError(params.setPartialRefundErrors, validation.draftKey)
  }

  async function submitAfterSalesRequest(orderId: OrderId) {
    const payload = validateAfterSalesDraft(params, orderId)
    if (!payload) return
    const success = await params.runAction(() => submitAfterSalesRequestApi(orderId, payload))
    if (!success) return
    params.setAfterSalesDrafts((current) => removeKey(current, orderId))
    clearDraftError(params.setAfterSalesErrors, orderId)
  }

  async function submitReview(
    orderId: OrderId,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ) {
    const draftKey = buildReviewDraftKey(orderId, target)
    const order = params.state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validateCustomerReviewSubmission(params, orderId, target)
    if (!validation.ok) return

    const success = await params.runAction(() => reviewOrder(orderId, validation.payload))
    if (!success) return

    params.setReviewDrafts((current) => removeKey(current, draftKey))
    clearDraftError(params.setReviewErrors, draftKey)

    const reviewCompleted = target === REVIEW_TARGET.store ? !hasPendingRiderReview(order) : true
    if (reviewCompleted) {
      params.navigate(ROUTE_PATH.customerOrders)
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
