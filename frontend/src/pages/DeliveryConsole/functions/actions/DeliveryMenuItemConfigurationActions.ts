import type {
  DisplayText,
  MenuItem,
  Quantity,
} from '@/objects/core/SharedObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import { buildCartLineKey, getMenuItemCartQuantity } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { buildSelectedMenuItemConfiguration, hasValidMenuItemSelections } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { DELIVERY_CONSOLE_MESSAGES, formatRemainingQuantityMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { asDomainNumber, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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
