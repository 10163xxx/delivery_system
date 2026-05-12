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
import type {
  CustomerOrderParams,
  OrderSubmissionValidationResult,
} from '@/customer/object/action/CustomerActionObjects'

export function validateCustomerOrderSubmission(params: CustomerOrderParams): OrderSubmissionValidationResult {
  const {
    customerRequiresDefaultAddressUpdate,
    deliveryAddress,
    payableTotalCents,
    scheduledDeliveryTime,
    scheduledDeliveryTouched,
    selectedCustomer,
    selectedStore,
    selectedStoreIsOpen,
    setDeliveryAddressError,
    setError,
    setScheduledDeliveryError,
    setScheduledDeliveryTime,
  } = params

  if (!selectedStore || !selectedCustomer) return { ok: false }
  const address = deliveryAddress.trim()
  if (!address) {
    setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressRequired)
    return { ok: false }
  }
  if (customerRequiresDefaultAddressUpdate) {
    setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate)
    setError(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate)
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
    params.remark,
    params.selectedCoupon?.id ?? '',
    params.quantities,
  )
  if (payload.items.length === 0) {
    setError(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected)
    return { ok: false }
  }
  if (payableTotalCents > selectedCustomer.balanceCents) {
    setError(DELIVERY_CONSOLE_MESSAGES.account.insufficientBalanceForOrder)
    return { ok: false }
  }
  return { ok: true }
}

export function resetCustomerOrderSubmissionState(params: CustomerOrderParams) {
  if (!params.selectedStore) return
  params.setDeliveryAddressError(null)
  params.setScheduledDeliveryError(null)
  params.setScheduledDeliveryTouched(false)
  params.setRemark('')
  params.setQuantities(getInitialQuantities(params.selectedStore))
  params.setIsCheckoutExpanded(false)
  params.setSelectedCouponId('')
  params.setError(null)
}

export function buildCustomerOrderRequestPayload(params: CustomerOrderParams) {
  if (!params.selectedStore || !params.selectedCustomer) return null
  return buildOrderPayload(
    params.selectedCustomer.id,
    params.selectedStore,
    params.deliveryAddress.trim(),
    params.scheduledDeliveryTime,
    params.remark,
    params.selectedCoupon?.id ?? '',
    params.quantities,
  )
}

export function buildCustomerOrderChatRequestPayload(orderChatDrafts: CustomerOrderParams['orderChatDrafts'], orderId: string) {
  return buildOrderChatPayload(orderChatDrafts[orderId] ?? '')
}
