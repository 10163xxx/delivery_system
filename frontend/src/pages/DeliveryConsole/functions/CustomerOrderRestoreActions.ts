// Repeat-order actions rebuild cart state from past orders while respecting current menu availability.
import type { MenuItem, OrderSummary, Store } from '@/objects/core/SharedObjects'
import type { DisplayText } from '@/objects/core/SharedObjects'
import { buildCartLineKey } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { buildSelectedMenuItemConfiguration, hasValidMenuItemSelections } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { DELIVERY_CONSOLE_MESSAGES, formatOrderRestoreCartSuccessMessage, formatOrderRestoreCheckoutSuccessMessage, formatOrderRestorePartialMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { getTodayDeliveryWindow } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import type { FeedbackTone } from '@/pages/DeliveryConsole/objects/DeliveryUiStateObjects'
import type { OrderRestoreMode } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { SelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { buildCustomerCartStoreRoute, buildCustomerOrderStoreRoute, ORDER_RESTORE_MODE } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import { FEEDBACK_PREFIX, FEEDBACK_TONE } from '@/pages/DeliveryConsole/objects/DeliveryUiStateObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

const FEEDBACK_MESSAGE = {
  [FEEDBACK_TONE.error]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.error]}${message}`,
  [FEEDBACK_TONE.info]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.info]}${message}`,
  [FEEDBACK_TONE.success]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.success]}${message}`,
  [FEEDBACK_TONE.warning]: (message: string) => `${FEEDBACK_PREFIX[FEEDBACK_TONE.warning]}${message}`,
} as const

function buildFeedbackMessage(tone: FeedbackTone, message: string) {
  return FEEDBACK_MESSAGE[tone](message)
}

function buildFeedbackText(tone: FeedbackTone, message: string) {
  return asDomainText<DisplayText>(buildFeedbackMessage(tone, message))
}

function restoreCustomerOrderAction(
  args: ActionArgs,
  order: OrderSummary,
  mode: OrderRestoreMode,
  todayDeliveryWindow = getTodayDeliveryWindow(),
) {
  const store = args.state?.stores.find((entry: Store) => entry.id === order.storeId)
  if (!store) {
    args.setError(buildFeedbackText(FEEDBACK_TONE.error, DELIVERY_CONSOLE_MESSAGES.order.restoreStoreUnavailable))
    return
  }

  const nextQuantities: Record<string, number> = {}
  const nextConfigurations: Record<string, SelectedMenuItemConfiguration> = {}
  let unavailableItemCount = 0
  let adjustedItemCount = 0

  // Rebuild cart lines against the current menu because stock and required options may have changed.
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
      orderedItem.selections.map((selection) => [
        selection.groupName,
        selection.selectedOptions.map((option) => asDomainText<DisplayText>(option)),
      ]),
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
    args.setError(buildFeedbackText(FEEDBACK_TONE.error, DELIVERY_CONSOLE_MESSAGES.order.restoreItemsUnavailable))
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
  args.setRemark(asDomainText<DisplayText>(''))
  args.setIsCheckoutExpanded(false)

  if (todayDeliveryWindow.isAvailable) {
    args.setScheduledDeliveryTime(asDomainText<DisplayText>(todayDeliveryWindow.minimumValue))
    args.setScheduledDeliveryError(null)
    args.setScheduledDeliveryTouched(false)
  }

  args.setSearchParams({
    [ROUTE_QUERY_KEY.store]: store.id,
    ...(store.category ? { [ROUTE_QUERY_KEY.category]: store.category } : {}),
  })
  const restoredCount = Object.values(nextQuantities).reduce((sum, quantity) => sum + quantity, 0)
  const partialMessage =
    unavailableItemCount > 0 || adjustedItemCount > 0
      ? buildFeedbackText(
          FEEDBACK_TONE.warning,
          formatOrderRestorePartialMessage(restoredCount),
        )
      : mode === ORDER_RESTORE_MODE.checkout
        ? buildFeedbackText(FEEDBACK_TONE.success, formatOrderRestoreCheckoutSuccessMessage(restoredCount))
        : buildFeedbackText(FEEDBACK_TONE.success, formatOrderRestoreCartSuccessMessage(restoredCount))
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
