import type {
  AddCustomerAddressRequest,
  CreateOrderRequest,
  MenuItem,
  RechargeBalanceRequest,
  ReviewOrderRequest,
  SendOrderChatMessageRequest,
  Store,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  UpdateCustomerProfileRequest,
} from '@/objects/core/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  REVIEW_TARGET,
} from '@/objects/core/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  MAX_ADDRESS_LABEL_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_CUSTOMER_NAME_LENGTH,
  MAX_ORDER_CHAT_LENGTH,
  MAX_ORDER_REMARK_LENGTH,
  MAX_REVIEW_COMMENT_LENGTH,
  MAX_REVIEW_EXTRA_NOTE_LENGTH,
  MIN_MENU_ITEM_QUANTITY,
} from './DeliveryConstants'
import { buildScheduledDeliveryAt } from './DeliverySchedule'
import { clampRating, normalizeTextInput, parseCurrencyAmount } from './DeliveryShared'
import type {
  AfterSalesDraft,
  CustomerAddressDraft,
  PartialRefundDraft,
  ReviewDraft,
  SelectedMenuItemConfiguration,
} from '@/objects/page/DeliveryAppObjects'
import {
  createInitialAfterSalesDraft,
  createInitialPartialRefundDraft,
  createInitialReviewDraft,
} from './DeliveryDrafts'

export const REQUIRED_MENU_CATEGORY_NAME = '必选品'
export const REQUIRED_MENU_CATEGORY_HASH = 'required-category'

export function buildOrderPayload(
  customerId: string,
  store: Store,
  deliveryAddress: string,
  scheduledDeliveryTime: string,
  remark: string,
  couponId: string,
  quantities: Record<string, number>,
  selectedMenuItemConfigurations: Record<string, SelectedMenuItemConfiguration>,
): CreateOrderRequest {
  const items = store.menu
    .map((item) => ({
      menuItemId: item.id,
      quantity: quantities[item.id] ?? 0,
      selections: selectedMenuItemConfigurations[item.id]?.selections ?? [],
    }))
    .filter((item) => item.quantity > 0)

  return {
    customerId,
    storeId: store.id,
    deliveryAddress: normalizeTextInput(deliveryAddress, MAX_ADDRESS_LENGTH),
    scheduledDeliveryAt: buildScheduledDeliveryAt(scheduledDeliveryTime),
    remark: normalizeTextInput(remark, MAX_ORDER_REMARK_LENGTH) || undefined,
    couponId: couponId || undefined,
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
) {
  return store.menu.some(
    (item) => item.category?.trim() === REQUIRED_MENU_CATEGORY_NAME && (quantities[item.id] ?? 0) > 0,
  )
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
      .map((group) => ({
        groupName: group.name,
        selectedOptions: Array.from(
          new Set(
            (selections[group.name] ?? []).filter((option) =>
              group.options.some((entry) => entry.name === option),
            ),
          ),
        ),
      }))
      .filter((selection) => selection.selectedOptions.length > 0),
    summaryText: buildMenuItemConfigurationSummary(item, selections),
  }
}

export function buildCustomerProfilePayload(name: string): UpdateCustomerProfileRequest {
  return { name: normalizeTextInput(name, MAX_CUSTOMER_NAME_LENGTH) }
}

export function buildCustomerAddressPayload(draft: CustomerAddressDraft): AddCustomerAddressRequest {
  return {
    label: normalizeTextInput(draft.label, MAX_ADDRESS_LABEL_LENGTH),
    address: normalizeTextInput(draft.address, MAX_ADDRESS_LENGTH),
  }
}

export function buildOrderChatPayload(body: string): SendOrderChatMessageRequest {
  return { body: normalizeTextInput(body, MAX_ORDER_CHAT_LENGTH) }
}

export function buildPartialRefundPayload(
  menuItemId: string,
  draft?: PartialRefundDraft,
): SubmitPartialRefundRequest {
  const nextDraft = draft ?? createInitialPartialRefundDraft()
  return {
    menuItemId,
    quantity: Math.max(MIN_MENU_ITEM_QUANTITY, Math.round(nextDraft.quantity)),
    reason: normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH),
  }
}

export function buildAfterSalesPayload(draft?: AfterSalesDraft): SubmitAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesDraft()
  const expectedCompensationYuan = Number(nextDraft.expectedCompensationYuan)
  const expectedCompensationCents =
    nextDraft.requestType === AFTER_SALES_REQUEST_TYPE.compensationRequest &&
    Number.isFinite(expectedCompensationYuan) &&
    expectedCompensationYuan > 0
      ? Math.round(expectedCompensationYuan * CURRENCY_CENTS_SCALE)
      : undefined

  return {
    requestType: nextDraft.requestType,
    reason: normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH),
    expectedCompensationCents,
  }
}

export function buildRechargePayload(amountYuan: number): RechargeBalanceRequest {
  return { amountCents: Math.round(amountYuan * CURRENCY_CENTS_SCALE) }
}

export function parseRechargeAmount(value: string) {
  return parseCurrencyAmount(value)
}

export function buildReviewPayload(
  target: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider,
  draft?: ReviewDraft,
): ReviewOrderRequest {
  const nextDraft = draft ?? createInitialReviewDraft()
  const comment = normalizeTextInput(nextDraft.comment, MAX_REVIEW_COMMENT_LENGTH)
  const extraNote = normalizeTextInput(nextDraft.extraNote, MAX_REVIEW_EXTRA_NOTE_LENGTH)
  const submission = {
    rating: clampRating(nextDraft.rating),
    comment: comment || undefined,
    extraNote: extraNote || undefined,
  }

  return target === REVIEW_TARGET.store ? { storeReview: submission } : { riderReview: submission }
}
