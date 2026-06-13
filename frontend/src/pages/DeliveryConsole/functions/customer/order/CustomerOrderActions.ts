import { createOrder, sendOrderChatMessage } from '@/system/api/SharedApi'
import { ROUTE_PATH, type DisplayText, type OrderId } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  CustomerOrderParams,
} from '@/pages/CustomerConsole/objects/CustomerActionObjects'
import {
  clearDraftError,
  removeKey,
  setDraftError,
} from '@/pages/DeliveryConsole/functions/customer/common/CustomerActionHelpers'
import {
  buildCustomerOrderChatRequestPayload,
  buildCustomerOrderRequestPayload,
  resetCustomerOrderSubmissionState,
  validateCustomerOrderSubmission,
} from '@/pages/DeliveryConsole/functions/customer/order/CustomerOrderActionHelpers'
import { FEEDBACK_PREFIX, FEEDBACK_TONE } from '@/pages/DeliveryConsole/objects/DeliveryUiStateObjects'

export function createCustomerOrderActions(params: CustomerOrderParams) {
  function openRechargePage() {
    params.actions.navigate(ROUTE_PATH.customerProfileRecharge)
  }

  async function submitOrder() {
    if (!params.selection.selectedStore || !params.selection.selectedCustomer) return
    if (!validateCustomerOrderSubmission(params).ok) return
    const payload = buildCustomerOrderRequestPayload(params)
    if (!payload) return
    const success = await params.actions.runAction(() => createOrder(payload))
    if (!success) return
    resetCustomerOrderSubmissionState(params)
    params.actions.setError(asDomainText<DisplayText>(`${FEEDBACK_PREFIX[FEEDBACK_TONE.success]}订单成功，已返回首页。`))
    params.actions.navigate(ROUTE_PATH.customerOrder, { replace: true })
  }

  async function submitOrderChatMessage(orderId: OrderId) {
    const payload = buildCustomerOrderChatRequestPayload(params.draft.orderChatDrafts, orderId)
    if (!payload.body) {
      setDraftError(params.actions.setOrderChatErrors, orderId, '消息内容不能为空')
      return
    }
    const success = await params.actions.runAction(() => sendOrderChatMessage(orderId, payload))
    if (!success) return
    params.actions.setOrderChatDrafts((current) => removeKey(current, orderId))
    clearDraftError(params.actions.setOrderChatErrors, orderId)
  }

  return {
    openRechargePage,
    submitOrder,
    submitOrderChatMessage,
  }
}
