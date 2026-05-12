import type {
  AddCustomerAddressRequest,
  CreateOrderRequest,
  RechargeBalanceRequest,
  ReviewOrderRequest,
  SendOrderChatMessageRequest,
  Store,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  UpdateCustomerProfileRequest,
} from '@/shared/object/core/SharedObjects'
import {
  AFTER_SALES_REQUEST_TYPE,
  REVIEW_TARGET,
} from '@/shared/object/core/SharedObjects'
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
} from '@/shared/object/core/DeliveryAppObjects'
import {
  createInitialAfterSalesDraft,
  createInitialPartialRefundDraft,
  createInitialReviewDraft,
} from './DeliveryDrafts'

export function buildOrderPayload(
  customerId: string,
  store: Store,
  deliveryAddress: string,
  scheduledDeliveryTime: string,
  remark: string,
  couponId: string,
  quantities: Record<string, number>,
): CreateOrderRequest {
  const items = store.menu
    .map((item) => ({ menuItemId: item.id, quantity: quantities[item.id] ?? 0 }))
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
