import type {
  AddCustomerAddressRequest,
  AddMenuItemRequest,
  CreateOrderRequest,
  MerchantRegistrationRequest,
  RechargeBalanceRequest,
  ResolveAfterSalesRequest,
  ResolvePartialRefundRequest,
  ResolveTicketRequest,
  ReviewMerchantApplicationRequest,
  ReviewOrderRequest,
  SendOrderChatMessageRequest,
  Store,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  UpdateCustomerProfileRequest,
  UpdateMerchantProfileRequest,
  WithdrawMerchantIncomeRequest,
} from '@/domain'
import { CURRENCY_CENTS_SCALE } from './constants'
import {
  MAX_ACCOUNT_HOLDER_LENGTH,
  MAX_ACCOUNT_NUMBER_LENGTH,
  MAX_ADDRESS_LABEL_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_APPEAL_REASON_LENGTH,
  MAX_BANK_NAME_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_CUSTOMER_NAME_LENGTH,
  MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  MAX_MENU_ITEM_NAME_LENGTH,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_ORDER_CHAT_LENGTH,
  MAX_ORDER_REMARK_LENGTH,
  MAX_PREP_MINUTES,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MAX_REVIEW_APPLICATION_NOTE_LENGTH,
  MAX_REVIEW_COMMENT_LENGTH,
  MAX_REVIEW_EXTRA_NOTE_LENGTH,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MAX_TICKET_RESOLUTION_LENGTH,
  MIN_MENU_ITEM_QUANTITY,
  MIN_PREP_MINUTES,
} from './constants'
import { buildScheduledDeliveryAt } from './schedule'
import { clampRating, normalizeTextInput, parseCurrencyAmount } from './shared'
import type {
  AfterSalesDraft,
  AfterSalesResolutionDraft,
  AppealResolutionDraft,
  CustomerAddressDraft,
  MenuItemDraft,
  MerchantDraft,
  MerchantProfileDraft,
  PartialRefundDraft,
  ReviewDraft,
} from './types'
import { createInitialAfterSalesDraft, createInitialAfterSalesResolutionDraft, createInitialPartialRefundDraft, createInitialReviewDraft } from './drafts'

export function buildMerchantRegistrationPayload(draft: MerchantDraft): MerchantRegistrationRequest {
  const merchantName = normalizeTextInput(draft.merchantName, MAX_MERCHANT_NAME_LENGTH)
  const storeName = normalizeTextInput(draft.storeName, MAX_STORE_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_STORE_CATEGORY_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const note = normalizeTextInput(draft.note, MAX_TICKET_NOTE_LENGTH)

  return {
    merchantName,
    storeName,
    category: category as MerchantRegistrationRequest['category'],
    businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
    avgPrepMinutes: Math.max(
      MIN_PREP_MINUTES,
      Math.min(MAX_PREP_MINUTES, Math.round(draft.avgPrepMinutes)),
    ),
    imageUrl: imageUrl || undefined,
    note: note || undefined,
  }
}

export function buildMenuItemPayload(draft: MenuItemDraft): AddMenuItemRequest {
  const name = normalizeTextInput(draft.name, MAX_MENU_ITEM_NAME_LENGTH)
  const description = normalizeTextInput(draft.description, MAX_MENU_ITEM_DESCRIPTION_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const price = Number(draft.priceYuan.trim())
  const remainingQuantity = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantity)

  return {
    name,
    description,
    priceCents: Number.isFinite(price) ? Math.round(price * CURRENCY_CENTS_SCALE) : 0,
    imageUrl: imageUrl || undefined,
    remainingQuantity:
      remainingQuantity === ''
        ? undefined
        : Number.isInteger(parsedRemainingQuantity)
          ? parsedRemainingQuantity
          : undefined,
  }
}

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

export function buildPartialRefundPayload(menuItemId: string, draft?: PartialRefundDraft): SubmitPartialRefundRequest {
  const nextDraft = draft ?? createInitialPartialRefundDraft()
  return {
    menuItemId,
    quantity: Math.max(MIN_MENU_ITEM_QUANTITY, Math.round(nextDraft.quantity)),
    reason: normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH),
  }
}

export function buildPartialRefundResolutionPayload(approved: boolean, resolutionNote: string): ResolvePartialRefundRequest {
  return {
    approved,
    resolutionNote:
      normalizeTextInput(resolutionNote, MAX_TICKET_NOTE_LENGTH) ||
      (approved ? '确认缺货，已退该商品' : '当前商品仍可正常出餐'),
  }
}

export function buildAfterSalesPayload(draft?: AfterSalesDraft): SubmitAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesDraft()
  const expectedCompensationYuan = Number(nextDraft.expectedCompensationYuan)
  const expectedCompensationCents =
    nextDraft.requestType === 'CompensationRequest' && Number.isFinite(expectedCompensationYuan) && expectedCompensationYuan > 0
      ? Math.round(expectedCompensationYuan * CURRENCY_CENTS_SCALE)
      : undefined

  return {
    requestType: nextDraft.requestType,
    reason: normalizeTextInput(nextDraft.reason, MAX_REVIEW_COMMENT_LENGTH),
    expectedCompensationCents,
  }
}

export function buildAfterSalesResolutionPayload(approved: boolean, draft?: AfterSalesResolutionDraft): ResolveAfterSalesRequest {
  const nextDraft = draft ?? createInitialAfterSalesResolutionDraft()
  const actualCompensationYuan = Number(nextDraft.actualCompensationYuan)
  const actualCompensationCents =
    Number.isFinite(actualCompensationYuan) && actualCompensationYuan > 0
      ? Math.round(actualCompensationYuan * CURRENCY_CENTS_SCALE)
      : undefined

  return {
    approved,
    resolutionNote:
      normalizeTextInput(nextDraft.resolutionNote, MAX_TICKET_NOTE_LENGTH) ||
      (approved ? '售后申请核实通过' : '售后申请未通过审核'),
    resolutionMode: approved ? nextDraft.resolutionMode : 'Manual',
    actualCompensationCents,
  }
}

export function buildRechargePayload(amountYuan: number): RechargeBalanceRequest {
  return { amountCents: Math.round(amountYuan * CURRENCY_CENTS_SCALE) }
}

export function buildMerchantProfilePayload(draft: MerchantProfileDraft): UpdateMerchantProfileRequest {
  return {
    contactPhone: normalizeTextInput(draft.contactPhone, MAX_CONTACT_PHONE_LENGTH),
    payoutAccount: {
      accountType: draft.payoutAccountType,
      bankName:
        draft.payoutAccountType === 'bank'
          ? normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH) || undefined
          : undefined,
      accountNumber: normalizeTextInput(draft.accountNumber, MAX_ACCOUNT_NUMBER_LENGTH),
      accountHolder: normalizeTextInput(draft.accountHolder, MAX_ACCOUNT_HOLDER_LENGTH),
    },
  }
}

export function buildMerchantWithdrawPayload(amountYuan: number): WithdrawMerchantIncomeRequest {
  return { amountCents: Math.round(amountYuan * CURRENCY_CENTS_SCALE) }
}

export function parseMerchantWithdrawAmount(value: string) {
  return parseCurrencyAmount(value)
}

export function parseRechargeAmount(value: string) {
  return parseCurrencyAmount(value)
}

export function buildReviewPayload(target: 'store' | 'rider', draft?: ReviewDraft): ReviewOrderRequest {
  const nextDraft = draft ?? createInitialReviewDraft()
  const comment = normalizeTextInput(nextDraft.comment, MAX_REVIEW_COMMENT_LENGTH)
  const extraNote = normalizeTextInput(nextDraft.extraNote, MAX_REVIEW_EXTRA_NOTE_LENGTH)
  const submission = {
    rating: clampRating(nextDraft.rating),
    comment: comment || undefined,
    extraNote: extraNote || undefined,
  }
  return target === 'store' ? { storeReview: submission } : { riderReview: submission }
}

export function buildReviewApplicationPayload(reviewNote: string): ReviewMerchantApplicationRequest {
  return {
    reviewNote:
      normalizeTextInput(reviewNote, MAX_REVIEW_APPLICATION_NOTE_LENGTH) || '资料已核验',
  }
}

export function buildResolutionPayload(draft?: ResolveTicketRequest): ResolveTicketRequest {
  const resolution = normalizeTextInput(
    draft?.resolution ?? '已回访用户',
    MAX_TICKET_RESOLUTION_LENGTH,
  )
  const note = normalizeTextInput(draft?.note ?? '已联系相关角色并记录', MAX_TICKET_NOTE_LENGTH)
  return { resolution: resolution || '已回访用户', note: note || '已联系相关角色并记录' }
}

export function buildReviewAppealPayload(appellantRole: 'Merchant' | 'Rider', reason: string) {
  return {
    appellantRole,
    reason:
      normalizeTextInput(reason, MAX_APPEAL_REASON_LENGTH) || '评价描述与实际履约情况不符',
  }
}

export function buildAppealResolutionPayload(draft?: AppealResolutionDraft): AppealResolutionDraft {
  return {
    approved: draft?.approved ?? true,
    resolutionNote:
      normalizeTextInput(
        draft?.resolutionNote ?? '申诉成立，已撤销评价',
        MAX_TICKET_NOTE_LENGTH,
      ) || '申诉成立，已撤销评价',
  }
}

export function buildEligibilityReviewPayload(target: 'Store' | 'Rider', targetId: string, reason: string) {
  return {
    target,
    targetId,
    reason:
      normalizeTextInput(reason, MAX_REJECT_ORDER_REASON_LENGTH) || '已完成整改，希望发起复核',
  }
}
