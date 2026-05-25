import type { Dispatch, SetStateAction } from 'react'
import type { MenuItem, OrderSummary, Store } from '@/shared/object/core/SharedObjects'
import {
  buildSelectedMenuItemConfiguration,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatOrderRestoreCartSuccessMessage,
  formatOrderRestoreCheckoutSuccessMessage,
  formatOrderRestorePartialMessage,
  formatRemainingQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  getInitialQuantities,
  getTodayDeliveryWindow,
  hasValidMenuItemSelections,
  validateScheduledDeliveryTime,
} from '@/shared/delivery/DeliveryServices'
import { ROUTE_QUERY_KEY } from '@/shared/object/core/SharedObjects'
import type {
  CustomerStoreQueryRoutePath,
  FeedbackTone,
  MenuItemConfigurationModalState,
  MerchantApplicationView,
  OrderRestoreMode,
  ReviewDraft,
  SelectedMenuItemConfiguration,
} from '@/shared/object/core/DeliveryAppObjects'
import {
  buildCustomerCartStoreRoute,
  buildCustomerOrderStoreRoute,
  FEEDBACK_PREFIX,
  FEEDBACK_TONE,
  ORDER_RESTORE_MODE,
} from '@/shared/object/core/DeliveryAppObjects'

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
  const nextQuantity = Math.max(0, nextValue)
  const remainingQuantity = menuItem.remainingQuantity
  const hasStockLimit = remainingQuantity != null
  const cappedQuantity =
    !hasStockLimit ? nextQuantity : Math.min(nextQuantity, Math.max(remainingQuantity, 0))

  if (nextQuantity > 0 && menuItem.selectionGroups.length > 0) {
    const currentConfiguration = args.selectedMenuItemConfigurations[menuItem.id]
    if (!hasValidMenuItemSelections(menuItem, currentConfiguration)) {
      args.setMenuItemConfigurationModal({
        itemId: menuItem.id,
        quantityAfterConfirm: cappedQuantity,
        draftSelections: Object.fromEntries(
          menuItem.selectionGroups.map((group) => [group.name, currentConfiguration?.selections.find((selection) => selection.groupName === group.name)?.selectedOptions ?? []]),
        ),
        errorText: null,
      })
      args.setError(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired)
      return
    }
  }

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

export function openMenuItemConfigurationAction(args: ActionArgs, menuItem: MenuItem) {
  const currentConfiguration = args.selectedMenuItemConfigurations[menuItem.id]
  args.setMenuItemConfigurationModal({
    itemId: menuItem.id,
    quantityAfterConfirm: Math.max(args.quantities[menuItem.id] ?? 0, 1),
    draftSelections: Object.fromEntries(
      menuItem.selectionGroups.map((group) => [
        group.name,
        currentConfiguration?.selections.find((selection) => selection.groupName === group.name)
          ?.selectedOptions ?? [],
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
  const selectedItems = args.selectedStore.menu.filter(
    (item: MenuItem) => (args.quantities[item.id] ?? 0) > 0,
  )
  if (selectedItems.length === 0) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected)
    return
  }
  if (selectedItems.some((item) => !hasValidMenuItemSelections(item, args.selectedMenuItemConfigurations[item.id]))) {
    args.setError(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired)
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

    nextQuantities[menuItem.id] = cappedQuantity
    if (configuration.selections.length > 0) {
      nextConfigurations[menuItem.id] = configuration
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

  args.setSelectedMenuItemConfigurations((current) => ({
    ...current,
    [menuItem.id]: nextConfiguration,
  }))
  args.setQuantities((current) => ({
    ...current,
    [menuItem.id]: quantityAfterConfirm,
  }))
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
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
