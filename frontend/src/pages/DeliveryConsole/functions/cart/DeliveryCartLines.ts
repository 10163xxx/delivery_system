import type { MenuItem, MenuItemId, Store } from '@/objects/core/SharedObjects'
import type { SelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export const CART_LINE_KEY_SEPARATOR = '::configuration::'

export type SelectedCartLine = {
  lineKey: string
  item: MenuItem
  quantity: number
  configuration: SelectedMenuItemConfiguration | undefined
}

export function buildCartLineKey(
  itemId: MenuItemId,
  configuration?: SelectedMenuItemConfiguration,
) {
  if (!configuration || configuration.selections.length === 0) return itemId
  const selectionSignature = encodeURIComponent(JSON.stringify(configuration.selections))
  return `${itemId}${CART_LINE_KEY_SEPARATOR}${selectionSignature}`
}

export function getCartLineItemId(lineKey: string) {
  return asDomainText<MenuItemId>(lineKey.split(CART_LINE_KEY_SEPARATOR)[0] ?? lineKey)
}

export function isCartLineForMenuItem(lineKey: string, itemId: MenuItemId) {
  return lineKey === itemId || lineKey.startsWith(`${itemId}${CART_LINE_KEY_SEPARATOR}`)
}

export function getMenuItemCartLineKeys(quantities: Record<string, number>, itemId: MenuItemId) {
  return Object.keys(quantities).filter(
    (lineKey) => isCartLineForMenuItem(lineKey, itemId) && (quantities[lineKey] ?? 0) > 0,
  )
}

export function getMenuItemCartQuantity(quantities: Record<string, number>, itemId: MenuItemId) {
  return getMenuItemCartLineKeys(quantities, itemId).reduce(
    (sum, lineKey) => sum + (quantities[lineKey] ?? 0),
    0,
  )
}

export function getTotalCartQuantity(quantities: Record<string, number>) {
  return Object.values(quantities).reduce((sum, quantity) => sum + Math.max(0, quantity), 0)
}

export function getSelectedCartLines(
  store: Store | undefined,
  quantities: Record<string, number>,
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>,
): SelectedCartLine[] {
  if (!store) return []
  const menuById = new Map(store.menu.map((item) => [item.id, item]))

  return Object.entries(quantities)
    .map(([lineKey, quantity]) => {
      const item = menuById.get(getCartLineItemId(lineKey))
      if (!item || quantity <= 0) return null
      return {
        lineKey,
        item,
        quantity,
        configuration: selectedMenuItemConfigurations[lineKey],
      }
    })
    .filter((line): line is SelectedCartLine => line !== null)
}
