import { createOrder, sendOrderChatMessage } from '@/shared/api/SharedApi'
import { ROUTE_PATH, type OrderId } from '@/shared/object/core/SharedObjects'
import type {
  CustomerOrderParams,
} from '@/pages/customer/object/CustomerActionObjects'
import { clearDraftError, removeKey, setDraftError } from '@/customer/app/actions/CustomerActionHelpers'
import {
  buildCustomerOrderChatRequestPayload,
  buildCustomerOrderRequestPayload,
  resetCustomerOrderSubmissionState,
  validateCustomerOrderSubmission,
} from '@/customer/app/actions/CustomerOrderActionHelpers'

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
