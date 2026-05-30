import { createOrder, sendOrderChatMessage } from '@/system/api/SharedApi'
import { ROUTE_PATH, type OrderId } from '@/objects/core/SharedObjects'
import type {
  CustomerOrderParams,
} from '@/objects/customer/page/CustomerActionObjects'
import { clearDraftError, removeKey, setDraftError } from '@/pages/delivery/app/actions/customer/common/CustomerActionHelpers'
import {
  buildCustomerOrderChatRequestPayload,
  buildCustomerOrderRequestPayload,
  resetCustomerOrderSubmissionState,
  validateCustomerOrderSubmission,
} from '@/pages/delivery/app/actions/customer/order/CustomerOrderActionHelpers'

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
