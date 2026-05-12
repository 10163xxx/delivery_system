import {
  REVIEW_TARGET,
  ROUTE_PATH,
} from '@/shared/object/core/SharedObjects'
import { deliveryApi } from '@/shared/api/SharedApi'
import { hasPendingRiderReview } from '@/shared/delivery/DeliveryServices'
import type {
  CustomerSupportParams,
} from '@/customer/object/action/CustomerActionObjects'
import { clearDraftError, removeKey } from '@/customer/app/actions/CustomerActionHelpers'
import {
  canSubmitPartialRefund,
  getRemainingRefundableQuantity,
  validateAfterSalesDraft,
  validateCustomerReviewSubmission,
  validatePartialRefundDraft,
} from '@/customer/app/actions/CustomerSupportActionHelpers'

export function createCustomerSupportActions(params: CustomerSupportParams) {
  async function submitPartialRefundRequest(orderId: string, menuItemId: string) {
    const order = params.state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validatePartialRefundDraft(params, order, menuItemId)
    if (!validation) return
    const success = await params.runAction(() =>
      deliveryApi.order.submitPartialRefundRequest(orderId, validation.payload),
    )
    if (!success) return
    params.setPartialRefundDrafts((current) => removeKey(current, validation.draftKey))
    clearDraftError(params.setPartialRefundErrors, validation.draftKey)
  }

  async function submitAfterSalesRequest(orderId: string) {
    const payload = validateAfterSalesDraft(params, orderId)
    if (!payload) return
    const success = await params.runAction(() =>
      deliveryApi.order.submitAfterSalesRequest(orderId, payload),
    )
    if (!success) return
    params.setAfterSalesDrafts((current) => removeKey(current, orderId))
    clearDraftError(params.setAfterSalesErrors, orderId)
  }

  async function submitReview(
    orderId: string,
    target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  ) {
    const draftKey = `${orderId}-${target}`
    const order = params.state?.orders.find((entry) => entry.id === orderId)
    if (!order) return
    const validation = validateCustomerReviewSubmission(params, orderId, target)
    if (!validation.ok) return

    const success = await params.runAction(() =>
      deliveryApi.order.reviewOrder(orderId, validation.payload),
    )
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
