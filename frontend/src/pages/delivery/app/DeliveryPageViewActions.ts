// UI action handlers for store navigation, cart edits, checkout, merchant view switching, and reviews.
import type {
  DisplayText,
  MenuItem,
  Quantity,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import {
  buildSelectedMenuItemConfiguration,
  buildCartLineKey,
  createInitialReviewDraft,
  DELIVERY_CONSOLE_MESSAGES,
  formatRequiredCategorySelectionMessage,
  formatRemainingQuantityMessage,
  formatStoreClosedMessage,
  formatBusinessHours,
  getInitialQuantities,
  getMenuItemCartLineKeys,
  getMenuItemCartQuantity,
  getRequiredCategoryItemNames,
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
  MerchantApplicationView,
  ReviewDraft,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  buildCustomerCartStoreRoute,
  buildCustomerOrderStoreRoute,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import type { ActionArgs } from '@/pages/delivery/app/DeliveryPageActionTypes'
import { asDomainNumber, asDomainText } from '@/features/delivery/DeliveryShared'
export type { ActionArgs } from '@/pages/delivery/app/DeliveryPageActionTypes'
export {
  addPreviousOrderToCartAction,
  repeatCustomerOrderAction,
} from '@/pages/delivery/app/CustomerOrderRestoreActions'

export function getTodayDeliveryWindowAction() {
  return getTodayDeliveryWindow()
}

export function chooseStoreCategoryAction(args: ActionArgs, category: string) {
  args.setSelectedStoreCategory(asDomainText<DisplayText>(category))
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({ [ROUTE_QUERY_KEY.category]: category })
}

export function resetStoreCategoryAction(args: ActionArgs) {
  args.setSelectedStoreCategory(asDomainText<DisplayText>(''))
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams({})
}

export function enterStoreAction(args: ActionArgs, storeId: StoreId) {
  const store = args.state?.stores.find((entry: Store) => entry.id === storeId)
  if (store?.category) {
    args.setSelectedStoreCategory(store.category)
  }
  args.setSelectedStoreId(storeId)
  args.setQuantities(getInitialQuantities(store))
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setSearchParams({
    [ROUTE_QUERY_KEY.store]: storeId,
    ...(store?.category ? { [ROUTE_QUERY_KEY.category]: store.category } : {}),
  })
}

export function leaveStoreAction(args: ActionArgs) {
  const store = args.selectedStore
  const category = store?.category
  args.setSelectedStoreId('')
  args.setQuantities({})
  args.setSelectedMenuItemConfigurations({})
  args.setMenuItemConfigurationModal(null)
  args.setError(null)
  args.setSearchParams(category ? { [ROUTE_QUERY_KEY.category]: category } : {})
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
  args.setSelectedMerchantStoreId(asDomainText<StoreId>(storeId))
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
    args.setError(asDomainText<DisplayText>(formatRemainingQuantityMessage(menuItem.name, remainingQuantity)))
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
  args.setError(
    hasStockLimit && nextValue > remainingQuantity
      ? asDomainText<DisplayText>(formatRemainingQuantityMessage(menuItem.name, remainingQuantity))
      : null,
  )
}

export function openMenuItemConfigurationAction(args: ActionArgs, menuItem: MenuItem) {
  args.setMenuItemConfigurationModal({
    itemId: menuItem.id,
    quantityAfterConfirm: asDomainNumber<Quantity>(1),
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
  // Checkout is guarded here because the cart UI and repeat-order restore both converge on this flow.
  if (!args.selectedStore || !args.selectedCustomer) return
  if (!args.selectedStoreIsOpen) {
    args.setError(asDomainText<DisplayText>(formatStoreClosedMessage(formatBusinessHours(args.selectedStore.businessHours))))
    return
  }
  const selectedLines = getSelectedCartLines(
    args.selectedStore,
    args.quantities,
    args.selectedMenuItemConfigurations,
  )
  if (selectedLines.length === 0) {
    args.setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.order.noMenuItemSelected))
    return
  }
  if (selectedLines.some((line) => !hasValidMenuItemSelections(line.item, line.configuration))) {
    args.setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired))
    return
  }
  if (
    storeHasRequiredMenuCategory(args.selectedStore) &&
    !hasSelectedRequiredCategoryItem(
      args.selectedStore,
      args.quantities,
      args.selectedMenuItemConfigurations,
    )
  ) {
    args.setError(
      asDomainText<DisplayText>(formatRequiredCategorySelectionMessage(
        REQUIRED_MENU_CATEGORY_NAME,
        getRequiredCategoryItemNames(args.selectedStore),
      )),
    )
    args.navigate(`${buildCustomerOrderStoreRoute(args.selectedStore.id)}#${REQUIRED_MENU_CATEGORY_HASH}`)
    return
  }

  if (!todayDeliveryWindow.isAvailable) {
    args.setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.schedule.noSameDayDeliveryWindow))
    return
  }

  args.setError(null)
  if (validateScheduledDeliveryTime(args.scheduledDeliveryTime) !== null) {
    args.setScheduledDeliveryTime(asDomainText<DisplayText>(todayDeliveryWindow.minimumValue))
    args.setScheduledDeliveryError(null)
    args.setScheduledDeliveryTouched(false)
  }
  args.navigate(buildCustomerCartStoreRoute(args.selectedStore.id))
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
      current && current.itemId === menuItem.id
        ? { ...current, errorText: asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.order.menuItemSelectionsRequired) }
        : current,
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
    args.setError(asDomainText<DisplayText>(formatRemainingQuantityMessage(menuItem.name, remainingQuantity ?? 0)))
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
      ? asDomainText<DisplayText>(formatRemainingQuantityMessage(menuItem.name, remainingQuantity ?? addQuantity))
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
  args.setReviewErrors((current: Record<string, DisplayText>) => {
    if (!current[orderId]) return current
    const next = { ...current }
    delete next[orderId]
    return next
  })
}
