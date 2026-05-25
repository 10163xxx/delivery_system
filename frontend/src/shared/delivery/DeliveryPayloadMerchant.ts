import type {
  AddMenuItemRequest,
  MenuItemSelectionGroup,
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
  MAX_MENU_ITEM_CATEGORY_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  MAX_MENU_ITEM_NAME_LENGTH,
  MAX_MENU_ITEM_SELECTION_GROUP_COUNT,
  MAX_MENU_ITEM_SELECTION_GROUP_NAME_LENGTH,
  MAX_MENU_ITEM_SELECTION_OPTION_COUNT,
  MAX_MENU_ITEM_SELECTION_OPTION_LENGTH,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_PREP_MINUTES,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MIN_PREP_MINUTES,
  PARTIAL_REFUND_APPROVED_NOTE,
  PARTIAL_REFUND_REJECTED_NOTE,
} from './DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from './DeliveryMessages'
import { normalizeTextInput, parseCurrencyAmount } from './DeliveryShared'
import type {
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  ParsedMenuItemSelectionGroups,
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
  const category = normalizeTextInput(draft.category, MAX_MENU_ITEM_CATEGORY_LENGTH)
  const description = normalizeTextInput(
    draft.description,
    MAX_MENU_ITEM_DESCRIPTION_LENGTH,
  )
  const imageUrl = draft.imageUrl.trim()
  const price = Number(draft.priceYuan.trim())
  const remainingQuantity = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantity)
  const selectionGroups = parseMenuItemSelectionGroups(draft.selectionGroupsText).groups

  return {
    name,
    category: category || undefined,
    description,
    priceCents: Number.isFinite(price) ? Math.round(price * CURRENCY_CENTS_SCALE) : 0,
    imageUrl: imageUrl || undefined,
    remainingQuantity:
      remainingQuantity === ''
        ? undefined
        : Number.isInteger(parsedRemainingQuantity)
          ? parsedRemainingQuantity
          : undefined,
    selectionGroups,
  }
}

function normalizeSelectionLinePart(value: string, maxLength: number) {
  return normalizeTextInput(value, maxLength)
}

function parseSelectionCountRange(rawRule: string) {
  const trimmed = rawRule.trim()
  if (!trimmed) return { minSelections: 1, maxSelections: 1, ok: true as const }
  const match = trimmed.match(/^\[(\d+)-(\d+)\]$/)
  if (!match) return { minSelections: 0, maxSelections: 0, ok: false as const }
  const minSelections = Number(match[1])
  const maxSelections = Number(match[2])
  if (!Number.isInteger(minSelections) || !Number.isInteger(maxSelections) || minSelections < 0 || maxSelections < minSelections) {
    return { minSelections: 0, maxSelections: 0, ok: false as const }
  }
  return { minSelections, maxSelections, ok: true as const }
}

export function parseMenuItemSelectionGroups(
  value: string,
): ParsedMenuItemSelectionGroups {
  const lines = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return { groups: [], errorText: null }
  if (lines.length > MAX_MENU_ITEM_SELECTION_GROUP_COUNT) {
    return { groups: [], errorText: DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid }
  }

  const groups: MenuItemSelectionGroup[] = []
  const usedNames = new Set<string>()

  for (const line of lines) {
    const [leftPart, rightPart, ...rest] = line.split(':')
    if (!leftPart || !rightPart || rest.length > 0) {
      return { groups: [], errorText: DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid }
    }
    const nameRuleMatch = leftPart.trim().match(/^([^[\]]+?)(\[\d+-\d+\])?$/)
    if (!nameRuleMatch) {
      return { groups: [], errorText: DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid }
    }
    const name = normalizeSelectionLinePart(nameRuleMatch[1] ?? '', MAX_MENU_ITEM_SELECTION_GROUP_NAME_LENGTH)
    const range = parseSelectionCountRange(nameRuleMatch[2] ?? '')
    const options = rightPart
      .split(',')
      .map((option) => normalizeSelectionLinePart(option, MAX_MENU_ITEM_SELECTION_OPTION_LENGTH))
      .filter(Boolean)

    if (
      !name ||
      usedNames.has(name) ||
      !range.ok ||
      options.length === 0 ||
      options.length > MAX_MENU_ITEM_SELECTION_OPTION_COUNT ||
      new Set(options).size !== options.length ||
      range.maxSelections === 0 ||
      range.maxSelections > options.length ||
      range.minSelections > options.length
    ) {
      return { groups: [], errorText: DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid }
    }

    usedNames.add(name)
    groups.push({
      name,
      minSelections: range.minSelections,
      maxSelections: range.maxSelections,
      options,
    })
  }

  return { groups, errorText: null }
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
