import {
  buildOrderChatPayload,
  buildOrderPayload,
  DELIVERY_CONSOLE_MESSAGES,
  formatRequiredCategorySelectionMessage,
  formatBusinessHours,
  formatStoreClosedMessage,
  getCustomerAddressCoordinate,
  getRequiredCategoryItemNames,
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
import { asDomainText } from '@/features/delivery/DeliveryShared'
import { buildCustomerOrderStoreRoute } from '@/pages/delivery/objects/DeliveryAppObjects'
import type {
  DisplayText,
  IsoDateTime,
  OrderId,
  StoreId,
} from '@/objects/core/SharedObjects'
import type {
  CustomerOrderParams,
  OrderSubmissionValidationResult,
} from '@/pages/customer/objects/CustomerActionObjects'

function toDisplayText(value: string) {
  return asDomainText<DisplayText>(value)
}

function returnToRequiredCategory(params: CustomerOrderParams, storeId: StoreId, message: string) {
  params.setIsCheckoutExpanded(false)
  params.setError(toDisplayText(message))
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
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressRequired))
    return { ok: false }
  }
  if (customerRequiresDefaultAddressUpdate) {
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate))
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate))
    return { ok: false }
  }
  const deliveryQuote = getStoreDeliveryQuote(
    selectedStore,
    getCustomerAddressCoordinate(selectedCustomer, address),
  )
  if (!deliveryQuote.isDeliverable) {
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange))
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange))
    return { ok: false }
  }
  setDeliveryAddressError(null)

  const todayDeliveryWindow = getTodayDeliveryWindow()
  const scheduledDeliveryError = validateScheduledDeliveryTime(scheduledDeliveryTime)
  if (scheduledDeliveryTouched && scheduledDeliveryError) {
    setScheduledDeliveryError(toDisplayText(scheduledDeliveryError))
    if (todayDeliveryWindow.isAvailable) {
      setScheduledDeliveryTime(asDomainText<IsoDateTime>(todayDeliveryWindow.minimumValue))
    }
    return { ok: false }
  }
  setScheduledDeliveryError(null)

  if (!selectedStoreIsOpen) {
    setError(toDisplayText(formatStoreClosedMessage(formatBusinessHours(selectedStore.businessHours))))
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
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected))
    return { ok: false }
  }
  if (
    getSelectedCartLines(
      selectedStore,
      params.quantities,
      params.selectedMenuItemConfigurations,
    ).some((line) => !hasValidMenuItemSelections(line.item, line.configuration))
  ) {
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired))
    return { ok: false }
  }
  if (
    storeHasRequiredMenuCategory(selectedStore) &&
    !hasSelectedRequiredCategoryItem(
      selectedStore,
      params.quantities,
      params.selectedMenuItemConfigurations,
    )
  ) {
    returnToRequiredCategory(
      params,
      selectedStore.id,
      formatRequiredCategorySelectionMessage(
        REQUIRED_MENU_CATEGORY_NAME,
        getRequiredCategoryItemNames(selectedStore),
      ),
    )
    return { ok: false }
  }
  if (payableTotalCents > selectedCustomer.balanceCents) {
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.account.insufficientBalanceForOrder))
    return { ok: false }
  }
  return { ok: true }
}

export function resetCustomerOrderSubmissionState(params: CustomerOrderParams) {
  if (!params.selectedStore) return
  params.setDeliveryAddressError(null)
  params.setScheduledDeliveryError(null)
  params.setScheduledDeliveryTouched(false)
  params.setRemark(toDisplayText(''))
  params.setQuantities(getInitialQuantities(params.selectedStore))
  params.setSelectedMenuItemConfigurations({})
  params.setMenuItemConfigurationModal(null)
  params.setIsCheckoutExpanded(false)
  params.setSelectedCouponId('')
  params.setSelectedStoreCategory(toDisplayText(''))
  params.setSelectedStoreId('')
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

export function buildCustomerOrderChatRequestPayload(orderChatDrafts: CustomerOrderParams['orderChatDrafts'], orderId: OrderId) {
  return buildOrderChatPayload(orderChatDrafts[orderId] ?? toDisplayText(''))
}
