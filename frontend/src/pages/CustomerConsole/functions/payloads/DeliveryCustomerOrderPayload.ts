import type {
  AddressText,
  CouponId,
  CreateOrderRequest,
  CustomerId,
  DisplayText,
  IsoDateTime,
  MenuItem,
  NoteText,
  Quantity,
  SendOrderChatMessageRequest,
  Store,
} from '@/objects/core/SharedObjects'
import {
  MAX_ADDRESS_LENGTH,
  MAX_ORDER_CHAT_LENGTH,
  MAX_ORDER_REMARK_LENGTH,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { buildScheduledDeliveryAt } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { asDomainNumber, asDomainText, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { SelectedMenuItemConfiguration } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export const REQUIRED_MENU_CATEGORY_NAME = '必选品'
export const REQUIRED_MENU_CATEGORY_HASH = 'required-category'

export type BuildOrderPayloadParams = {
  customerId: string
  store: Store
  deliveryAddress: string
  scheduledDeliveryTime: string
  remark: string
  couponId: string
  quantities: Record<string, number>
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>
}

export function buildOrderPayload(params: BuildOrderPayloadParams): CreateOrderRequest {
  const {
    customerId,
    store,
    deliveryAddress,
    scheduledDeliveryTime,
    remark,
    couponId,
    quantities,
    selectedMenuItemConfigurations,
  } = params
  const items = getSelectedCartLines(
    store,
    quantities,
    selectedMenuItemConfigurations,
  ).map((line) => ({
    menuItemId: line.item.id,
    quantity: asDomainNumber<Quantity>(line.quantity),
    selections: line.configuration?.selections ?? [],
  }))

  return {
    customerId: asDomainText<CustomerId>(customerId),
    storeId: store.id,
    deliveryAddress: asDomainText<AddressText>(normalizeTextInput(deliveryAddress, MAX_ADDRESS_LENGTH)),
    scheduledDeliveryAt: asDomainText<IsoDateTime>(buildScheduledDeliveryAt(scheduledDeliveryTime)),
    remark: optionalDomainText<NoteText>(normalizeTextInput(remark, MAX_ORDER_REMARK_LENGTH)),
    couponId: optionalDomainText<CouponId>(couponId),
    items,
  }
}

export function hasValidMenuItemSelections(
  item: MenuItem,
  selectedConfiguration?: SelectedMenuItemConfiguration,
) {
  if (item.selectionGroups.length === 0) return true
  if (!selectedConfiguration) return false
  const selectionMap = new Map(
    selectedConfiguration.selections.map((selection) => [selection.groupName, selection.selectedOptions]),
  )

  return item.selectionGroups.every((group) => {
    const selectedOptions = selectionMap.get(group.name) ?? []
    return (
      selectedOptions.length >= group.minSelections &&
      selectedOptions.length <= group.maxSelections &&
      selectedOptions.every((option) => group.options.some((entry) => entry.name === option))
    )
  })
}

export function storeHasRequiredMenuCategory(store: Store) {
  return store.menu.some((item) => item.category?.trim() === REQUIRED_MENU_CATEGORY_NAME)
}

export function hasSelectedRequiredCategoryItem(
  store: Store,
  quantities: Record<string, number>,
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration> = {},
) {
  return getSelectedCartLines(
    store,
    quantities,
    selectedMenuItemConfigurations,
  ).some(
    (line) => line.item.category?.trim() === REQUIRED_MENU_CATEGORY_NAME,
  )
}

export function getRequiredCategoryItemNames(store: Store) {
  return store.menu
    .filter((item) => item.category?.trim() === REQUIRED_MENU_CATEGORY_NAME)
    .map((item) => item.name)
}

export function buildMenuItemConfigurationSummary(item: MenuItem, selections: Record<string, string[]>) {
  return item.selectionGroups
    .map((group) => {
      const selectedOptions = selections[group.name] ?? []
      if (selectedOptions.length === 0) return null
      return `${group.name}：${selectedOptions.join(' / ')}`
    })
    .filter(Boolean)
    .join('；')
}

export function buildSelectedMenuItemConfiguration(item: MenuItem, selections: Record<string, string[]>) {
  return {
    selections: item.selectionGroups
      .map((group) => {
        const selectedOptions = (selections[group.name] ?? [])
          .filter((option) => group.options.some((entry) => entry.name === option))
          .reduce<string[]>(
            (uniqueOptions, option) =>
              uniqueOptions.includes(option) ? uniqueOptions : [...uniqueOptions, option],
            [],
          )

        return {
          groupName: group.name,
          selectedOptions: selectedOptions.map((option) => asDomainText<DisplayText>(option)),
        }
      })
      .filter((selection) => selection.selectedOptions.length > 0),
    summaryText: asDomainText<DisplayText>(buildMenuItemConfigurationSummary(item, selections)),
  }
}

export function buildOrderChatPayload(body: string): SendOrderChatMessageRequest {
  return { body: asDomainText<DisplayText>(normalizeTextInput(body, MAX_ORDER_CHAT_LENGTH)) }
}
