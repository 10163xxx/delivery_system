import { buildOrderChatPayload, buildOrderPayload, getRequiredCategoryItemNames, hasSelectedRequiredCategoryItem, hasValidMenuItemSelections, REQUIRED_MENU_CATEGORY_HASH, REQUIRED_MENU_CATEGORY_NAME, storeHasRequiredMenuCategory } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { DELIVERY_CONSOLE_MESSAGES, formatRequiredCategorySelectionMessage, formatStoreClosedMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { formatBusinessHours, getTodayDeliveryWindow, validateScheduledDeliveryTime } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { getCustomerAddressCoordinate, getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import { getInitialQuantities } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { buildCustomerOrderStoreRoute } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type {
  DisplayText,
  IsoDateTime,
  OrderId,
  StoreId,
} from '@/objects/core/SharedObjects'
import type {
  CustomerOrderParams,
  OrderSubmissionValidationResult,
} from '@/pages/CustomerConsole/objects/CustomerActionObjects'

function toDisplayText(value: string) {
  return asDomainText<DisplayText>(value)
}

function returnToRequiredCategory(params: CustomerOrderParams, storeId: StoreId, message: string) {
  params.actions.setIsCheckoutExpanded(false)
  params.actions.setError(toDisplayText(message))
  params.actions.navigate(`${buildCustomerOrderStoreRoute(storeId)}#${REQUIRED_MENU_CATEGORY_HASH}`)
}

function validateDeliveryAddressForOrder(params: CustomerOrderParams, address: string) {
  const { actions, selection } = params
  const { customerRequiresDefaultAddressUpdate, selectedCustomer, selectedStore } = selection
  const { setDeliveryAddressError, setError } = actions

  if (!address) {
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressRequired))
    return false
  }
  if (customerRequiresDefaultAddressUpdate) {
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate))
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryAddressPendingProfileUpdate))
    return false
  }
  if (!selectedStore || !selectedCustomer) return false

  const deliveryQuote = getStoreDeliveryQuote(
    selectedStore,
    getCustomerAddressCoordinate(selectedCustomer, address),
  )
  if (!deliveryQuote.isDeliverable) {
    setDeliveryAddressError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange))
    setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.schedule.deliveryDistanceOutOfRange))
    return false
  }
  setDeliveryAddressError(null)
  return true
}

function validateScheduledDeliveryForOrder(params: CustomerOrderParams) {
  const { actions, draft } = params
  const scheduledDeliveryError = validateScheduledDeliveryTime(draft.scheduledDeliveryTime)
  if (draft.scheduledDeliveryTouched && scheduledDeliveryError) {
    actions.setScheduledDeliveryError(toDisplayText(scheduledDeliveryError))
    const todayDeliveryWindow = getTodayDeliveryWindow()
    if (todayDeliveryWindow.isAvailable) {
      actions.setScheduledDeliveryTime(asDomainText<IsoDateTime>(todayDeliveryWindow.minimumValue))
    }
    return false
  }
  actions.setScheduledDeliveryError(null)
  return true
}

function validateStoreIsOpenForOrder(params: CustomerOrderParams) {
  const { actions, selection } = params
  if (!selection.selectedStore || selection.selectedStoreIsOpen) return true

  actions.setError(
    toDisplayText(formatStoreClosedMessage(formatBusinessHours(selection.selectedStore.businessHours))),
  )
  return false
}

function validateOrderPayloadItems(
  params: CustomerOrderParams,
  payload: ReturnType<typeof buildOrderPayload>,
) {
  const { actions, draft, selection } = params
  if (!selection.selectedStore) return false

  if (payload.items.length === 0) {
    actions.setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected))
    return false
  }
  if (
    getSelectedCartLines(
      selection.selectedStore,
      draft.quantities,
      draft.selectedMenuItemConfigurations,
    ).some((line) => !hasValidMenuItemSelections(line.item, line.configuration))
  ) {
    actions.setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired))
    return false
  }
  return true
}

function validateRequiredMenuCategoryForOrder(params: CustomerOrderParams) {
  const { draft, selection } = params
  if (!selection.selectedStore) return false
  if (!storeHasRequiredMenuCategory(selection.selectedStore)) return true
  if (
    hasSelectedRequiredCategoryItem(
      selection.selectedStore,
      draft.quantities,
      draft.selectedMenuItemConfigurations,
    )
  ) {
    return true
  }

  returnToRequiredCategory(
    params,
    selection.selectedStore.id,
    formatRequiredCategorySelectionMessage(
      REQUIRED_MENU_CATEGORY_NAME,
      getRequiredCategoryItemNames(selection.selectedStore),
    ),
  )
  return false
}

function validateCustomerBalanceForOrder(params: CustomerOrderParams) {
  const { actions, selection } = params
  if (!selection.selectedCustomer) return false
  if (selection.payableTotalCents <= selection.selectedCustomer.balanceCents) return true

  actions.setError(toDisplayText(DELIVERY_CONSOLE_MESSAGES.account.insufficientBalanceForOrder))
  return false
}

export function validateCustomerOrderSubmission(params: CustomerOrderParams): OrderSubmissionValidationResult {
  const { draft, selection } = params
  const {
    selectedCustomer,
    selectedStore,
  } = selection
  const {
    deliveryAddress,
    quantities,
    remark,
    scheduledDeliveryTime,
    selectedMenuItemConfigurations,
  } = draft

  if (!selectedStore || !selectedCustomer) return { ok: false }
  const address = deliveryAddress.trim()
  if (!validateDeliveryAddressForOrder(params, address)) return { ok: false }
  if (!validateScheduledDeliveryForOrder(params)) return { ok: false }
  if (!validateStoreIsOpenForOrder(params)) return { ok: false }

  const payload = buildOrderPayload({
    customerId: selectedCustomer.id,
    store: selectedStore,
    deliveryAddress: address,
    scheduledDeliveryTime,
    remark,
    couponId: selection.selectedCoupon?.id ?? '',
    quantities,
    selectedMenuItemConfigurations,
  })

  return {
    ok:
      validateOrderPayloadItems(params, payload) &&
      validateRequiredMenuCategoryForOrder(params) &&
      validateCustomerBalanceForOrder(params),
  }
}

export function resetCustomerOrderSubmissionState(params: CustomerOrderParams) {
  const { actions, selection } = params
  if (!selection.selectedStore) return
  actions.setDeliveryAddressError(null)
  actions.setScheduledDeliveryError(null)
  actions.setScheduledDeliveryTouched(false)
  actions.setRemark(toDisplayText(''))
  actions.setQuantities(getInitialQuantities(selection.selectedStore))
  actions.setSelectedMenuItemConfigurations({})
  actions.setMenuItemConfigurationModal(null)
  actions.setIsCheckoutExpanded(false)
  actions.setSelectedCouponId('')
  actions.setSelectedStoreCategory(toDisplayText(''))
  actions.setSelectedStoreId('')
  actions.setError(null)
}

export function buildCustomerOrderRequestPayload(params: CustomerOrderParams) {
  const { draft, selection } = params
  if (!selection.selectedStore || !selection.selectedCustomer) return null
  return buildOrderPayload({
    customerId: selection.selectedCustomer.id,
    store: selection.selectedStore,
    deliveryAddress: draft.deliveryAddress.trim(),
    scheduledDeliveryTime: draft.scheduledDeliveryTime,
    remark: draft.remark,
    couponId: selection.selectedCoupon?.id ?? '',
    quantities: draft.quantities,
    selectedMenuItemConfigurations: draft.selectedMenuItemConfigurations,
  })
}

export function buildCustomerOrderChatRequestPayload(orderChatDrafts: CustomerOrderParams['draft']['orderChatDrafts'], orderId: OrderId) {
  return buildOrderChatPayload(orderChatDrafts[orderId] ?? toDisplayText(''))
}
