import type {
  DisplayText,
  MenuItem,
} from '@/objects/core/SharedObjects'
import type { ActionArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageActionTypes'
import { getMenuItemCartLineKeys, getMenuItemCartQuantity } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { buildSelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { formatRemainingQuantityMessage } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { openMenuItemConfigurationAction } from '@/pages/DeliveryConsole/functions/actions/DeliveryMenuItemConfigurationActions'

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
