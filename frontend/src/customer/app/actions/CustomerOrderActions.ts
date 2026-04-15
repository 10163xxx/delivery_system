import {
  createOrder as createOrderRequest,
  sendOrderChatMessage as sendOrderChatMessageRequest,
} from '@/shared/api/SharedApi'
import { ROUTE_PATH } from '@/shared/object/SharedObjects'
import {
  buildOrderChatPayload,
  buildOrderPayload,
  DELIVERY_CONSOLE_MESSAGES,
  formatBusinessHours,
  formatStoreClosedMessage,
  getInitialQuantities,
  getTodayDeliveryWindow,
  validateScheduledDeliveryTime,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'
import { clearDraftError, removeKey, setDraftError } from '@/customer/app/actions/CustomerActionHelpers'

type CustomerOrderParams = Pick<
  CustomerActionParams,
  | 'selectedStore'
  | 'selectedStoreIsOpen'
  | 'selectedCustomer'
  | 'selectedCoupon'
  | 'quantities'
  | 'deliveryAddress'
  | 'scheduledDeliveryTime'
  | 'scheduledDeliveryTouched'
  | 'remark'
  | 'payableTotalCents'
  | 'orderChatDrafts'
  | 'runAction'
  | 'navigate'
  | 'setDeliveryAddressError'
  | 'setScheduledDeliveryError'
  | 'setScheduledDeliveryTime'
  | 'setScheduledDeliveryTouched'
  | 'setRemark'
  | 'setQuantities'
  | 'setIsCheckoutExpanded'
  | 'setSelectedCouponId'
  | 'setError'
  | 'setOrderChatErrors'
  | 'setOrderChatDrafts'
>

type OrderSubmissionValidationResult = { ok: true } | { ok: false }

export function createCustomerOrderActions(params: CustomerOrderParams) {
  const {
    selectedStore,
    selectedStoreIsOpen,
    selectedCustomer,
    selectedCoupon,
    quantities,
    deliveryAddress,
    scheduledDeliveryTime,
    scheduledDeliveryTouched,
    remark,
    payableTotalCents,
    orderChatDrafts,
    runAction,
    navigate,
    setDeliveryAddressError,
    setScheduledDeliveryError,
    setScheduledDeliveryTime,
    setScheduledDeliveryTouched,
    setRemark,
    setQuantities,
    setIsCheckoutExpanded,
    setSelectedCouponId,
    setError,
    setOrderChatErrors,
    setOrderChatDrafts,
  } = params

  function openRechargePage() {
    navigate(ROUTE_PATH.customerProfileRecharge)
  }

  function validateOrderSubmission(): OrderSubmissionValidationResult {
    if (!selectedStore || !selectedCustomer) return { ok: false }
    const address = deliveryAddress.trim()
    if (!address) {
      setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.deliveryAddressRequired)
      return { ok: false }
    }
    setDeliveryAddressError(null)

    const todayDeliveryWindow = getTodayDeliveryWindow()
    const scheduledDeliveryError = validateScheduledDeliveryTime(scheduledDeliveryTime)
    if (scheduledDeliveryTouched && scheduledDeliveryError) {
      setScheduledDeliveryError(scheduledDeliveryError)
      if (todayDeliveryWindow.isAvailable) {
        setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
      }
      return { ok: false }
    }
    setScheduledDeliveryError(null)

    if (!selectedStoreIsOpen) {
      setError(formatStoreClosedMessage(formatBusinessHours(selectedStore.businessHours)))
      return { ok: false }
    }

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      address,
      scheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )
    if (payload.items.length === 0) {
      setError(DELIVERY_CONSOLE_MESSAGES.noMenuItemSelected)
      return { ok: false }
    }
    if (payableTotalCents > selectedCustomer.balanceCents) {
      setError(DELIVERY_CONSOLE_MESSAGES.insufficientBalanceForOrder)
      return { ok: false }
    }
    return { ok: true }
  }

  function resetOrderSubmissionState() {
    if (!selectedStore) return
    setDeliveryAddressError(null)
    setScheduledDeliveryError(null)
    setScheduledDeliveryTouched(false)
    setRemark('')
    setQuantities(getInitialQuantities(selectedStore))
    setIsCheckoutExpanded(false)
    setSelectedCouponId('')
    setError(null)
  }

  async function submitOrder() {
    if (!selectedStore || !selectedCustomer) return
    if (!validateOrderSubmission().ok) return

    const payload = buildOrderPayload(
      selectedCustomer.id,
      selectedStore,
      deliveryAddress.trim(),
      scheduledDeliveryTime,
      remark,
      selectedCoupon?.id ?? '',
      quantities,
    )
    const success = await runAction(() => createOrderRequest(payload))
    if (!success) return
    resetOrderSubmissionState()
  }

  async function submitOrderChatMessage(orderId: string) {
    const body = orderChatDrafts[orderId] ?? ''
    const payload = buildOrderChatPayload(body)
    if (!payload.body) {
      setDraftError(setOrderChatErrors, orderId, DELIVERY_CONSOLE_MESSAGES.orderChatMessageRequired)
      return
    }
    const success = await runAction(() => sendOrderChatMessageRequest(orderId, payload))
    if (!success) return
    setOrderChatDrafts((current) => removeKey(current, orderId))
    clearDraftError(setOrderChatErrors, orderId)
  }

  return {
    openRechargePage,
    submitOrder,
    submitOrderChatMessage,
  }
}
