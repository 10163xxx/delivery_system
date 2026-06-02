import type { Dispatch, SetStateAction } from 'react'
import type { MenuItem, OrderSummary, Store } from '@/objects/core/SharedObjects'
import {
  buildSelectedMenuItemConfiguration,
  buildCartLineKey,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatOrderRestoreCartSuccessMessage,
  formatOrderRestoreCheckoutSuccessMessage,
  formatOrderRestorePartialMessage,
  formatRequiredCategorySelectionMessage,
  formatRemainingQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  getInitialQuantities,
  getMenuItemCartLineKeys,
  getMenuItemCartQuantity,
  getSelectedCartLines,
  getTodayDeliveryWindow,
  hasSelectedRequiredCategoryItem,
  hasValidMenuItemSelections,
  REQUIRED_MENU_CATEGORY_HASH,
  REQUIRED_MENU_CATEGORY_NAME,
  storeHasRequiredMenuCategory,
  validateScheduledDeliveryTime,
} from '@/features/delivery/DeliveryServices'
import { ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import type {
  CustomerStoreQueryRoutePath,
  FeedbackTone,
  MenuItemConfigurationModalState,
  MerchantApplicationView,
  OrderRestoreMode,
  ReviewDraft,
  SelectedMenuItemConfiguration,
} from '@/objects/page/DeliveryAppObjects'
import {
  buildCustomerCartStoreRoute,
  buildCustomerOrderStoreRoute,
  FEEDBACK_PREFIX,
  FEEDBACK_TONE,
  ORDER_RESTORE_MODE,
} from '@/objects/page/DeliveryAppObjects'

type ActionSelectionArgs = {
  state: { stores: Store[] } | null
  selectedStore: Store | undefined
  selectedCustomer: { coupons: { id: string; minimumSpendCents: number }[] } | undefined
  selectedStoreIsOpen: boolean
  quantities: Record<string, number>
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>
  scheduledDeliveryTime: string
}

type ActionRoutingArgs = {
  navigate: (path: CustomerStoreQueryRoutePath | string, options?: { replace?: boolean }) => void
  setSelectedStoreCategory: Dispatch<SetStateAction<string>>
  setSelectedStoreId: Dispatch<SetStateAction<string>>
  setSearchParams: (nextInit: URLSearchParams | Record<string, string>) => void
  setSelectedMerchantStoreId: Dispatch<SetStateAction<string>>
  setMerchantApplicationState: Dispatch<SetStateAction<MerchantApplicationView>>
}

type ActionFeedbackArgs = {
  setQuantities: Dispatch<SetStateAction<Record<string, number>>>
  setSelectedMenuItemConfigurations: Dispatch<
    SetStateAction<Record<string, SelectedMenuItemConfiguration>>
  >
  setMenuItemConfigurationModal: Dispatch<SetStateAction<MenuItemConfigurationModalState | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setIsCheckoutExpanded: Dispatch<SetStateAction<boolean>>
  setRemark: Dispatch<SetStateAction<string>>
  setScheduledDeliveryTime: Dispatch<SetStateAction<string>>
  setScheduledDeliveryError: Dispatch<SetStateAction<string | null>>
  setScheduledDeliveryTouched: Dispatch<SetStateAction<boolean>>
  setSelectedCouponId: Dispatch<SetStateAction<string>>
}

type ActionReviewArgs = {
  setReviewDrafts: Dispatch<SetStateAction<Record<string, ReviewDraft>>>
  setReviewErrors: Dispatch<SetStateAction<Record<string, string>>>
}

export type ActionArgs = ActionSelectionArgs &
  ActionRoutingArgs &
  ActionFeedbackArgs &
  ActionReviewArgs

const FEEDBACK_MESSAGE = {
  [FEEDBACK_TONE.error]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.error]}${message}`,
  [FEEDBACK_TONE.info]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.info]}${message}`,
  [FEEDBACK_TONE.success]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.success]}${message}`,
  [FEEDBACK_TONE.warning]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.warning]}${message}`,
} as const

function buildFeedbackMessage(tone: FeedbackTone, message: string) {
  return FEEDBACK_MESSAGE[tone](message)
}

export function getTodayDeliveryWindowAction() {
  return getTodayDeliveryWindow()
}

export function chooseStoreCategoryAction(args: ActionArgs, category: string) {
  args.setSelectedStoreCategory(category)
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({})
}

export function resetStoreCategoryAction(args: ActionArgs) {
  args.setSelectedStoreCategory('')
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({})
}

export function enterStoreAction(args: ActionArgs, storeId: string) {
  const store = args.state?.stores.find((entry: Store) => entry.id === storeId)
  if (store?.category) {
    args.setSelectedStoreCategory(store.category)
  }
  args.setSelectedStoreId(storeId)
  args.setQuantities(getInitialQuantities(store))
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setSearchParams({ [ROUTE_QUERY_KEY.store]: storeId })
}

export function leaveStoreAction(args: ActionArgs) {
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({})
}

export function changeMerchantApplicationViewAction(
  args: ActionArgs,
  view: MerchantApplicationView,
) {
  args.setMerchantApplicationState(view)
  args.setSearchParams({ [ROUTE_QUERY_KEY.merchantView]: view })
  args.setError(null)
}

export function leaveMerchantStoreAction(args: ActionArgs) {
  args.setError(null)
  args.setSelectedMerchantStoreId('')
}

export function enterMerchantStoreAction(args: ActionArgs, storeId: string) {
  args.setError(null)
  args.setSelectedMerchantStoreId(storeId)
}

export function updateQuantityAction(args: ActionArgs, menuItem: MenuItem, nextValue: number) {
  const currentQuantity = getMenuItemCartQuantity(args.quantities, menuItem.id)
  if (menuItem.selectionGroups.length > 0 && nextValue > currentQuantity) {
    openMenuItemConfigurationAction(args, menuItem)
    return
  }

  if (menuItem.selectionGroups.length > 0) {
    const lineKeys = getMenuItemCartLineKeys(args.quantities, menuItem.id)
    args.setQuantities((current) => {
      const next = { ...current }
      if (nextValue <= 0) {
        lineKeys.forEach((lineKey) => delete next[lineKey])
        return next
      }
      const lineKey = [...lineKeys].reverse()[0]
      if (!lineKey) return next
      const nextLineQuantity = Math.max(0, (next[lineKey] ?? 0) - 1)
      if (nextLineQuantity > 0) next[lineKey] = nextLineQuantity
      else delete next[lineKey]
      return next
    })

    args.setSelectedMenuItemConfigurations((current) => {
      const next = { ...current }
      if (nextValue <= 0) lineKeys.forEach((lineKey) => delete next[lineKey])
      else {
        const lineKey = [...lineKeys].reverse()[0]
        if (lineKey && (args.quantities[lineKey] ?? 0) <= 1) delete next[lineKey]
      }
      return next
    })
    args.setError(null)
    return
  }

  const nextQuantity = Math.max(0, nextValue)
  const remainingQuantity = menuItem.remainingQuantity
  const hasStockLimit = remainingQuantity != null
  const cappedQuantity =
    !hasStockLimit ? nextQuantity : Math.min(nextQuantity, Math.max(remainingQuantity, 0))

  args.setQuantities((current: Record<string, number>) => ({
    ...current,
    [menuItem.id]: cappedQuantity,
  }))

  if (cappedQuantity === 0) {
    args.setSelectedMenuItemConfigurations((current) => {
      if (!current[menuItem.id]) return current
      const next = { ...current }
      delete next[menuItem.id]
      return next
    })
  }

  if (hasStockLimit && nextQuantity > remainingQuantity) {
    args.setError(formatRemainingQuantityMessage(menuItem.name, remainingQuantity))
  } else {
    args.setError(null)
  }
}

export function updateCartLineQuantityAction(
  args: ActionArgs,
  menuItem: MenuItem,
  lineKey: string,
  nextValue: number,
) {
  if (menuItem.selectionGroups.length > 0 && nextValue > (args.quantities[lineKey] ?? 0)) {
    openMenuItemConfigurationAction(args, menuItem)
    return
  }

  const remainingQuantity = menuItem.remainingQuantity
  const hasStockLimit = remainingQuantity != null
  const cappedQuantity =
    !hasStockLimit ? Math.max(0, nextValue) : Math.min(Math.max(0, nextValue), Math.max(remainingQuantity, 0))

  args.setQuantities((current) => {
    const next = { ...current }
    if (cappedQuantity > 0) next[lineKey] = cappedQuantity
    else delete next[lineKey]
    return next
  })
  if (cappedQuantity === 0) {
    args.setSelectedMenuItemConfigurations((current) => {
      const next = { ...current }
      delete next[lineKey]
      return next
    })
  }
  args.setError(hasStockLimit && nextValue > remainingQuantity ? formatRemainingQuantityMessage(menuItem.name, remainingQuantity) : null)
}

export function openMenuItemConfigurationAction(args: ActionArgs, menuItem: MenuItem) {
  args.setMenuItemConfigurationModal({
    itemId: menuItem.id,
    quantityAfterConfirm: 1,
    draftSelections: Object.fromEntries(
      menuItem.selectionGroups.map((group) => [
        group.name,
        [],
      ]),
    ),
    errorText: null,
  })
  args.setError(null)
}

export function openCheckoutAction(args: ActionArgs, todayDeliveryWindow = getTodayDeliveryWindow()) {
  if (!args.selectedStore || !args.selectedCustomer) return
  if (!args.selectedStoreIsOpen) {
    args.setError(formatStoreClosedMessage(formatBusinessHours(args.selectedStore.businessHours)))
    return
  }
  const selectedLines = getSelectedCartLines(
    args.selectedStore,
    args.quantities,
    args.selectedMenuItemConfigurations,
  )
  if (selectedLines.length === 0) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected)
    return
  }
  if (selectedLines.some((line) => !hasValidMenuItemSelections(line.item, line.configuration))) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired)
    return
  }
  if (
    storeHasRequiredMenuCategory(args.selectedStore) &&
    !hasSelectedRequiredCategoryItem(args.selectedStore, args.quantities)
  ) {
    args.setError(formatRequiredCategorySelectionMessage(REQUIRED_MENU_CATEGORY_NAME))
    args.navigate(`${buildCustomerOrderStoreRoute(args.selectedStore.id)}#${REQUIRED_MENU_CATEGORY_HASH}`)
    return
  }

  if (!todayDeliveryWindow.isAvailable) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.schedule.noSameDayDeliveryWindow)
    return
  }

  args.setError(null)
  if (validateScheduledDeliveryTime(args.scheduledDeliveryTime) !== null) {
    args.setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
    args.setScheduledDeliveryError(null)
    args.setScheduledDeliveryTouched(false)
  }
  args.navigate(buildCustomerCartStoreRoute(args.selectedStore.id))
}

function restoreCustomerOrderAction(
  args: ActionArgs,
  order: OrderSummary,
  mode: OrderRestoreMode,
  todayDeliveryWindow = getTodayDeliveryWindow(),
) {
  const store = args.state?.stores.find((entry: Store) => entry.id === order.storeId)
  if (!store) {
    args.setError(buildFeedbackMessage(FEEDBACK_TONE.error, DELIVERY_CONSOLE_MESSAGES.order.restoreStoreUnavailable))
    return
  }

  const nextQuantities: Record<string, number> = {}
  const nextConfigurations: Record<string, SelectedMenuItemConfiguration> = {}
  let unavailableItemCount = 0
  let adjustedItemCount = 0

  order.items.forEach((orderedItem) => {
    const menuItem = store.menu.find((entry: MenuItem) => entry.id === orderedItem.menuItemId)
    if (!menuItem) {
      unavailableItemCount += 1
      return
    }

    const stockLimit = menuItem.remainingQuantity
    const cappedQuantity =
      stockLimit == null
        ? orderedItem.quantity
        : Math.min(orderedItem.quantity, Math.max(stockLimit, 0))

    if (cappedQuantity <= 0) {
      unavailableItemCount += 1
      return
    }

    const orderedSelections = Object.fromEntries(
      orderedItem.selections.map((selection) => [selection.groupName, selection.selectedOptions]),
    )
    const configuration = buildSelectedMenuItemConfiguration(menuItem, orderedSelections)

    if (menuItem.selectionGroups.length > 0 && !hasValidMenuItemSelections(menuItem, configuration)) {
      adjustedItemCount += 1
      return
    }

    const lineKey = buildCartLineKey(menuItem.id, configuration)
    nextQuantities[lineKey] = (nextQuantities[lineKey] ?? 0) + cappedQuantity
    if (configuration.selections.length > 0) {
      nextConfigurations[lineKey] = configuration
    }

    if (cappedQuantity < orderedItem.quantity) {
      adjustedItemCount += 1
    }
  })

  if (Object.keys(nextQuantities).length === 0) {
    args.setError(buildFeedbackMessage(FEEDBACK_TONE.error, DELIVERY_CONSOLE_MESSAGES.order.restoreItemsUnavailable))
    return
  }

  if (store.category) {
    args.setSelectedStoreCategory(store.category)
  }
  args.setSelectedStoreId(store.id)
  args.setQuantities(nextQuantities)
  args.setSelectedMenuItemConfigurations(nextConfigurations)
  args.setMenuItemConfigurationModal(null)
  args.setSelectedCouponId('')
  args.setRemark('')
  args.setIsCheckoutExpanded(false)

  if (todayDeliveryWindow.isAvailable) {
    args.setScheduledDeliveryTime(todayDeliveryWindow.minimumValue)
    args.setScheduledDeliveryError(null)
    args.setScheduledDeliveryTouched(false)
  }

  args.setSearchParams({ [ROUTE_QUERY_KEY.store]: store.id })
  const restoredCount = Object.values(nextQuantities).reduce((sum, quantity) => sum + quantity, 0)
  const partialMessage =
    unavailableItemCount > 0 || adjustedItemCount > 0
      ? buildFeedbackMessage(
          FEEDBACK_TONE.warning,
          formatOrderRestorePartialMessage(restoredCount),
        )
      : mode === ORDER_RESTORE_MODE.checkout
        ? buildFeedbackMessage(FEEDBACK_TONE.success, formatOrderRestoreCheckoutSuccessMessage(restoredCount))
        : buildFeedbackMessage(FEEDBACK_TONE.success, formatOrderRestoreCartSuccessMessage(restoredCount))
  args.setError(partialMessage)
  args.navigate(
    mode === ORDER_RESTORE_MODE.checkout
      ? buildCustomerCartStoreRoute(store.id)
      : buildCustomerOrderStoreRoute(store.id),
  )
}

export function repeatCustomerOrderAction(
  args: ActionArgs,
  order: OrderSummary,
  todayDeliveryWindow = getTodayDeliveryWindow(),
) {
  restoreCustomerOrderAction(args, order, ORDER_RESTORE_MODE.checkout, todayDeliveryWindow)
}

export function addPreviousOrderToCartAction(
  args: ActionArgs,
  order: OrderSummary,
  todayDeliveryWindow = getTodayDeliveryWindow(),
) {
  restoreCustomerOrderAction(args, order, ORDER_RESTORE_MODE.cart, todayDeliveryWindow)
}

export function confirmMenuItemConfigurationAction(
  args: ActionArgs,
  menuItem: MenuItem,
  quantityAfterConfirm: number,
  selections: Record<string, string[]>,
) {
  const nextConfiguration = buildSelectedMenuItemConfiguration(menuItem, selections)
  if (!hasValidMenuItemSelections(menuItem, nextConfiguration)) {
    args.setMenuItemConfigurationModal((current) =>
      current && current.itemId === menuItem.id ? { ...current, errorText: DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired } : current,
    )
    return
  }

  const currentQuantity = getMenuItemCartQuantity(args.quantities, menuItem.id)
  const remainingQuantity = menuItem.remainingQuantity
  const addQuantity =
    remainingQuantity == null
      ? quantityAfterConfirm
      : Math.min(quantityAfterConfirm, Math.max(remainingQuantity - currentQuantity, 0))
  if (addQuantity <= 0) {
    args.setMenuItemConfigurationModal(null)
    args.setError(formatRemainingQuantityMessage(menuItem.name, remainingQuantity ?? 0))
    return
  }
  const lineKey = buildCartLineKey(menuItem.id, nextConfiguration)
  args.setSelectedMenuItemConfigurations((current) => ({
    ...current,
    [lineKey]: nextConfiguration,
  }))
  args.setQuantities((current) => ({
    ...current,
    [lineKey]: (current[lineKey] ?? 0) + addQuantity,
  }))
  args.setMenuItemConfigurationModal(null)
  args.setError(
    addQuantity < quantityAfterConfirm
      ? formatRemainingQuantityMessage(menuItem.name, remainingQuantity ?? addQuantity)
      : null,
  )
}

export function closeMenuItemConfigurationAction(args: ActionArgs) {
  args.setMenuItemConfigurationModal(null)
}

export function updateReviewDraftAction(
  args: ActionArgs,
  orderId: string,
  patch: Partial<ReviewDraft>,
) {
  args.setReviewDrafts((current: Record<string, ReviewDraft>) => ({
    ...current,
    [orderId]: {
      ...(current[orderId] ?? createInitialReviewDraft()),
      ...patch,
    },
  }))
  args.setReviewErrors((current: Record<string, string>) => {
    if (!current[orderId]) return current
    const next = { ...current }
    delete next[orderId]
    return next
  })
}
