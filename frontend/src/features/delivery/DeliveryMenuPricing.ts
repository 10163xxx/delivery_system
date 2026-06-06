import type {
  MenuItem,
  MenuItemSelectionGroup,
  MenuItemSelectionOption,
  Store,
} from '@/objects/core/SharedObjects'
import type { SelectedMenuItemConfiguration } from '@/pages/delivery/objects/DeliveryAppObjects'
import { formatStartingPrice } from './DeliveryFormatters'
import { getSelectedCartLines } from './DeliveryCartLines'

function findSelectionOption(
  group: MenuItemSelectionGroup,
  optionName: string,
): MenuItemSelectionOption | undefined {
  return group.options.find((option) => option.name === optionName)
}

function sumSelectedAdditionalPriceCents(
  group: MenuItemSelectionGroup,
  selectedOptions: string[],
) {
  return selectedOptions.reduce(
    (sum, optionName) => sum + (findSelectionOption(group, optionName)?.additionalPriceCents ?? 0),
    0,
  )
}

function getGroupMinimumAdditionalPriceCents(group: MenuItemSelectionGroup) {
  if (group.minSelections <= 0) return 0
  return [...group.options]
    .sort((left, right) => left.additionalPriceCents - right.additionalPriceCents)
    .slice(0, group.minSelections)
    .reduce((sum, option) => sum + option.additionalPriceCents, 0)
}

export function getMenuItemConfiguredUnitPriceCents(
  item: MenuItem,
  selectedConfiguration?: SelectedMenuItemConfiguration,
) {
  if (!selectedConfiguration) return item.priceCents
  const selectionMap = new Map(
    selectedConfiguration.selections.map((selection) => [selection.groupName, selection.selectedOptions]),
  )
  return (
    item.priceCents +
    item.selectionGroups.reduce(
      (sum, group) => sum + sumSelectedAdditionalPriceCents(group, selectionMap.get(group.name) ?? []),
      0,
    )
  )
}

export function getMenuItemStartingPriceCents(item: MenuItem) {
  return (
    item.priceCents +
    item.selectionGroups.reduce(
      (sum, group) => sum + getGroupMinimumAdditionalPriceCents(group),
      0,
    )
  )
}

export function hasMenuItemAdditionalPriceOptions(item: MenuItem) {
  return item.selectionGroups.some((group) =>
    group.options.some((option) => option.additionalPriceCents > 0),
  )
}

export function getMenuItemDisplayPriceText(
  item: MenuItem,
  formatPrice: (priceCents: number) => string,
) {
  return hasMenuItemAdditionalPriceOptions(item)
    ? formatStartingPrice(getMenuItemStartingPriceCents(item))
    : formatPrice(item.priceCents)
}

export function getCartSubtotalCents(
  store: Store | undefined,
  quantities: Record<string, number>,
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>,
) {
  if (!store) return 0
  return getSelectedCartLines(store, quantities, selectedMenuItemConfigurations).reduce(
    (sum, line) =>
      sum + getMenuItemConfiguredUnitPriceCents(line.item, line.configuration) * line.quantity,
    0,
  )
}
