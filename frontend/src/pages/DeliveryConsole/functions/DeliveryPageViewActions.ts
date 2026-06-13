// UI action handlers for store navigation, cart edits, checkout, merchant view switching, and reviews.
import type {
  DisplayText,
  MenuItem,
  Quantity,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import { buildSelectedMenuItemConfiguration, getRequiredCategoryItemNames, hasSelectedRequiredCategoryItem, hasValidMenuItemSelections, REQUIRED_MENU_CATEGORY_HASH, REQUIRED_MENU_CATEGORY_NAME, storeHasRequiredMenuCategory } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { buildCartLineKey, getMenuItemCartLineKeys, getMenuItemCartQuantity, getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { createInitialReviewDraft, getInitialQuantities } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'
import { DELIVERY_CONSOLE_MESSAGES, formatRequiredCategorySelectionMessage, formatRemainingQuantityMessage, formatStoreClosedMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { formatBusinessHours, getTodayDeliveryWindow, validateScheduledDeliveryTime } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import type { MerchantApplicationView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import type { ReviewDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { buildCustomerCartStoreRoute, buildCustomerOrderStoreRoute } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import { asDomainNumber, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
export type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
export {
  addPreviousOrderToCartAction,
  repeatCustomerOrderAction,
} from '@/pages/DeliveryConsole/functions/CustomerOrderRestoreActions'

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
    updateConfiguredMenuItemQuantity(args, menuItem, nextValue)
    return
  }

  updateSimpleMenuItemQuantity(args, menuItem, nextValue)
}

function updateConfiguredMenuItemQuantity(args: ActionArgs, menuItem: MenuItem, nextValue: number) {
  const lineKeys = getMenuItemCartLineKeys(args.quantities, menuItem.id)
  const lineKeyToReduce = [...lineKeys].reverse()[0]

  args.setQuantities((current) => reduceConfiguredCartQuantities(current, lineKeys, lineKeyToReduce, nextValue))
  args.setSelectedMenuItemConfigurations((current) =>
    removeUnusedConfiguredSelections(current, args.quantities, lineKeys, lineKeyToReduce, nextValue),
  )
  args.setError(null)
}

function reduceConfiguredCartQuantities(
  current: Record<string, number>,
  lineKeys: string[],
  lineKeyToReduce: string | undefined,
  nextValue: number,
) {
  const next = { ...current }
  if (nextValue <= 0) {
    lineKeys.forEach((lineKey) => delete next[lineKey])
    return next
  }
  if (!lineKeyToReduce) return next
  const nextLineQuantity = Math.max(0, (next[lineKeyToReduce] ?? 0) - 1)
  if (nextLineQuantity > 0) next[lineKeyToReduce] = nextLineQuantity
  else delete next[lineKeyToReduce]
  return next
}

function removeUnusedConfiguredSelections(
  current: Record<string, ReturnType<typeof buildSelectedMenuItemConfiguration>>,
  quantities: Record<string, number>,
  lineKeys: string[],
  lineKeyToReduce: string | undefined,
  nextValue: number,
) {
  const next = { ...current }
  if (nextValue <= 0) lineKeys.forEach((lineKey) => delete next[lineKey])
  else if (lineKeyToReduce && (quantities[lineKeyToReduce] ?? 0) <= 1) delete next[lineKeyToReduce]
  return next
}

function updateSimpleMenuItemQuantity(args: ActionArgs, menuItem: MenuItem, nextValue: number) {
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
