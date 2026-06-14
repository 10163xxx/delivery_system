import type { DisplayText } from '@/objects/core/SharedObjects'
import { buildCustomerCartStoreRoute, buildCustomerOrderStoreRoute } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { getRequiredCategoryItemNames, hasSelectedRequiredCategoryItem, hasValidMenuItemSelections, REQUIRED_MENU_CATEGORY_HASH, REQUIRED_MENU_CATEGORY_NAME, storeHasRequiredMenuCategory } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { formatBusinessHours, getTodayDeliveryWindow, validateScheduledDeliveryTime } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { DELIVERY_CONSOLE_MESSAGES, formatRequiredCategorySelectionMessage, formatStoreClosedMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function getTodayDeliveryWindowAction() {
  return getTodayDeliveryWindow()
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
