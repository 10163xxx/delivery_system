import { createOrder, sendOrderChatMessage } from '@/system/api/SharedApi'
import { ROUTE_PATH, type OrderId } from '@/objects/core/SharedObjects'
import type {
  CustomerOrderParams,
} from '@/objects/customer/page/CustomerActionObjects'
import {
  clearDraftError,
  removeKey,
  setDraftError,
} from '@/pages/delivery/app/actions/customer/common/CustomerActionHelpers'
import {
  buildCustomerOrderChatRequestPayload,
  buildCustomerOrderRequestPayload,
  resetCustomerOrderSubmissionState,
  validateCustomerOrderSubmission,
} from '@/pages/delivery/app/actions/customer/order/CustomerOrderActionHelpers'
import { FEEDBACK_PREFIX, FEEDBACK_TONE } from '@/objects/page/DeliveryAppObjects'

export function createCustomerOrderActions(params: CustomerOrderParams) {
  function openRechargePage() {
    params.navigate(ROUTE_PATH.customerProfileRecharge)
  }

  async function submitOrder() {
    if (!params.selectedStore || !params.selectedCustomer) return
    if (!validateCustomerOrderSubmission(params).ok) return
    const payload = buildCustomerOrderRequestPayload(params)
    if (!payload) return
    const success = await params.runAction(() => createOrder(payload))
    if (!success) return
    resetCustomerOrderSubmissionState(params)
    params.setError(`${FEEDBACK_PREFIX[FEEDBACK_TONE.success]}订单已成功提交，已返回主界面。`)
    params.navigate(ROUTE_PATH.customerOrder, { replace: true })
  }

  async function submitOrderChatMessage(orderId: OrderId) {
    const payload = buildCustomerOrderChatRequestPayload(params.orderChatDrafts, orderId)
    if (!payload.body) {
      setDraftError(params.setOrderChatErrors, orderId, '消息内容不能为空')
      return
    }
    const success = await params.runAction(() => sendOrderChatMessage(orderId, payload))
    if (!success) return
    params.setOrderChatDrafts((current) => removeKey(current, orderId))
    clearDraftError(params.setOrderChatErrors, orderId)
  }

  return {
    openRechargePage,
    submitOrder,
    submitOrderChatMessage,
  }
}
