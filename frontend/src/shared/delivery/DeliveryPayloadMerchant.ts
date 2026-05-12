import type {
  AddMenuItemRequest,
  MerchantRegistrationRequest,
  ResolveAfterSalesRequest,
  ResolvePartialRefundRequest,
  UpdateMerchantProfileRequest,
  WithdrawMerchantIncomeRequest,
} from '@/shared/object/core/SharedObjects'
import {
  AFTER_SALES_RESOLUTION_MODE,
  PAYOUT_ACCOUNT_TYPE,
} from '@/shared/object/core/SharedObjects'
import {
  AFTER_SALES_APPROVED_NOTE,
  AFTER_SALES_REJECTED_NOTE,
  CURRENCY_CENTS_SCALE,
  MAX_ACCOUNT_HOLDER_LENGTH,
  MAX_ACCOUNT_NUMBER_LENGTH,
  MAX_BANK_NAME_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  MAX_MENU_ITEM_NAME_LENGTH,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_PREP_MINUTES,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MIN_PREP_MINUTES,
  PARTIAL_REFUND_APPROVED_NOTE,
  PARTIAL_REFUND_REJECTED_NOTE,
} from './DeliveryConstants'
import { normalizeTextInput, parseCurrencyAmount } from './DeliveryShared'
import type {
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  MerchantProfileDraft,
} from '@/shared/object/core/DeliveryAppObjects'
import { createInitialAfterSalesResolutionDraft } from './DeliveryDrafts'

export function buildMerchantRegistrationPayload(
  draft: MerchantDraft,
): MerchantRegistrationRequest {
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
  const description = normalizeTextInput(
    draft.description,
    MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  )
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

export function buildPartialRefundResolutionPayload(
  approved: boolean,
  resolutionNote: string,
): ResolvePartialRefundRequest {
  return {
    approved,
    resolutionNote:
      normalizeTextInput(resolutionNote, MAX_TICKET_NOTE_LENGTH) ||
      (approved ? PARTIAL_REFUND_APPROVED_NOTE : PARTIAL_REFUND_REJECTED_NOTE),
  }
}

export function buildAfterSalesResolutionPayload(
  approved: boolean,
  draft?: AfterSalesResolutionDraft,
): ResolveAfterSalesRequest {
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
      (approved ? AFTER_SALES_APPROVED_NOTE : AFTER_SALES_REJECTED_NOTE),
    resolutionMode: approved
      ? nextDraft.resolutionMode
      : AFTER_SALES_RESOLUTION_MODE.manual,
    actualCompensationCents,
  }
}

export function buildMerchantProfilePayload(
  draft: MerchantProfileDraft,
): UpdateMerchantProfileRequest {
  return {
    contactPhone: normalizeTextInput(draft.contactPhone, MAX_CONTACT_PHONE_LENGTH),
    payoutAccount: {
      accountType: draft.payoutAccountType,
      bankName:
        draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
          ? normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH) || undefined
          : undefined,
      accountNumber: normalizeTextInput(draft.accountNumber, MAX_ACCOUNT_NUMBER_LENGTH),
      accountHolder: normalizeTextInput(draft.accountHolder, MAX_ACCOUNT_HOLDER_LENGTH),
    },
  }
}

export function buildMerchantWithdrawPayload(
  amountYuan: number,
): WithdrawMerchantIncomeRequest {
  return { amountCents: Math.round(amountYuan * CURRENCY_CENTS_SCALE) }
}

export function parseMerchantWithdrawAmount(value: string) {
  return parseCurrencyAmount(value)
}
