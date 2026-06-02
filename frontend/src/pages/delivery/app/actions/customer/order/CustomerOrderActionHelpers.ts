import {
  buildOrderChatPayload,
  buildOrderPayload,
  DELIVERY_CONSOLE_MESSAGES,
  formatRequiredCategorySelectionMessage,
  formatBusinessHours,
  formatStoreClosedMessage,
  getCustomerAddressCoordinate,
  getInitialQuantities,
  getSelectedCartLines,
  getStoreDeliveryQuote,
  getTodayDeliveryWindow,
  hasSelectedRequiredCategoryItem,
  hasValidMenuItemSelections,
  REQUIRED_MENU_CATEGORY_HASH,
  REQUIRED_MENU_CATEGORY_NAME,
  storeHasRequiredMenuCategory,
  validateScheduledDeliveryTime,
} from '@/features/delivery/DeliveryServices'
import { buildCustomerOrderStoreRoute } from '@/objects/page/DeliveryAppObjects'
import type {
  CustomerOrderParams,
  OrderSubmissionValidationResult,
} from '@/objects/customer/page/CustomerActionObjects'

function returnToRequiredCategory(params: CustomerOrderParams, storeId: string, message: string) {
  params.setIsCheckoutExpanded(false)
  params.setError(message)
  params.navigate(`${buildCustomerOrderStoreRoute(storeId)}#${REQUIRED_MENU_CATEGORY_HASH}`)
}

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
  const deliveryQuote = getStoreDeliveryQuote(
    selectedStore,
    getCustomerAddressCoordinate(selectedCustomer, address),
  )
  if (!deliveryQuote.isDeliverable) {
    setDeliveryAddressError(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange)
    setError(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange)
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
    params.selectedMenuItemConfigurations,
  )
  if (payload.items.length === 0) {
    setError(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected)
    return { ok: false }
  }
  if (
    getSelectedCartLines(
      selectedStore,
      params.quantities,
      params.selectedMenuItemConfigurations,
    ).some((line) => !hasValidMenuItemSelections(line.item, line.configuration))
  ) {
    setError(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired)
    return { ok: false }
  }
  if (
    storeHasRequiredMenuCategory(selectedStore) &&
    !hasSelectedRequiredCategoryItem(selectedStore, params.quantities)
  ) {
    returnToRequiredCategory(
      params,
      selectedStore.id,
      formatRequiredCategorySelectionMessage(REQUIRED_MENU_CATEGORY_NAME),
    )
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
  params.setSelectedMenuItemConfigurations({})
  params.setMenuItemConfigurationModal(null)
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
    params.selectedMenuItemConfigurations,
  )
}

export function buildCustomerOrderChatRequestPayload(orderChatDrafts: CustomerOrderParams['orderChatDrafts'], orderId: string) {
  return buildOrderChatPayload(orderChatDrafts[orderId] ?? '')
}
