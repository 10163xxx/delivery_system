import type {
  AddMenuItemRequest,
  AccountHolderName,
  AccountNumber,
  AddressText,
  BankName,
  CurrencyCents,
  DescriptionText,
  DisplayText,
  MenuItemSelectionGroup,
  MenuItemSelectionOption,
  MerchantRegistrationRequest,
  DeliveryCoordinate,
  EntityCount,
  ImageUrl,
  Minutes,
  NoteText,
  PhoneNumber,
  Quantity,
  ResolveAfterSalesRequest,
  ResolvePartialRefundRequest,
  ResolutionText,
  UpdateMerchantProfileRequest,
  WithdrawMerchantIncomeRequest,
} from '@/objects/core/SharedObjects'
import {
  AFTER_SALES_RESOLUTION_MODE,
  PAYOUT_ACCOUNT_TYPE,
} from '@/objects/core/SharedObjects'
import {
  MAX_ADDRESS_LENGTH,
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
  MAX_MENU_ITEM_STOCK,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_PREP_MINUTES,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MAX_TICKET_NOTE_LENGTH,
  MIN_PREP_MINUTES,
  PARTIAL_REFUND_APPROVED_NOTE,
  PARTIAL_REFUND_REJECTED_NOTE,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { asDomainBoolean, asDomainNumber, asDomainText, normalizeTextInput, parseCurrencyAmount } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  AfterSalesResolutionDraft,
  MenuItemDraft,
  MerchantDraft,
  ParsedMenuItemSelectionGroups,
} from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { MerchantProfileDraft } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import { createInitialAfterSalesResolutionDraft } from '@/pages/DeliveryConsole/functions/drafts/DeliveryDrafts'

export function buildMerchantRegistrationPayload(
  draft: MerchantDraft,
  location?: DeliveryCoordinate,
): MerchantRegistrationRequest {
  const merchantName = normalizeTextInput(draft.merchantName, MAX_MERCHANT_NAME_LENGTH)
  const storeName = normalizeTextInput(draft.storeName, MAX_STORE_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_STORE_CATEGORY_LENGTH)
  const storeAddress = normalizeTextInput(draft.storeAddress, MAX_ADDRESS_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const note = normalizeTextInput(draft.note, MAX_TICKET_NOTE_LENGTH)

  return {
    merchantName: asDomainText<MerchantRegistrationRequest['merchantName']>(merchantName),
    storeName: asDomainText<DisplayText>(storeName),
    category: category as MerchantRegistrationRequest['category'],
    storeAddress: asDomainText<AddressText>(storeAddress),
    location,
    businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
    avgPrepMinutes: asDomainNumber<Minutes>(
      Math.max(
        MIN_PREP_MINUTES,
        Math.min(MAX_PREP_MINUTES, Math.round(draft.avgPrepMinutes)),
      ),
    ),
    imageUrl: optionalDomainText<ImageUrl>(imageUrl),
    note: optionalDomainText<NoteText>(note),
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
    name: asDomainText<DisplayText>(name),
    category: optionalDomainText<DisplayText>(category),
    description: asDomainText<DescriptionText>(description),
    priceCents: asDomainNumber<CurrencyCents>(Number.isFinite(price) ? Math.round(price * CURRENCY_CENTS_SCALE) : 0),
    imageUrl: optionalDomainText<ImageUrl>(imageUrl),
    remainingQuantity:
      remainingQuantity === '' ||
      (Number.isInteger(parsedRemainingQuantity) && parsedRemainingQuantity > MAX_MENU_ITEM_STOCK)
        ? undefined
        : Number.isInteger(parsedRemainingQuantity)
          ? asDomainNumber<Quantity>(parsedRemainingQuantity)
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

function parseSelectionOption(rawOption: string): MenuItemSelectionOption | null {
  const trimmed = rawOption.trim()
  if (!trimmed) return null
  const match = trimmed.match(/^(.*?)(?:\(\+(\d+(?:\.\d{1,2})?)\))?$/)
  if (!match) return null
  const name = normalizeSelectionLinePart(
    match[1] ?? '',
    MAX_MENU_ITEM_SELECTION_OPTION_LENGTH,
  )
  if (!name) return null
  const additionalPriceYuan = match[2] == null ? 0 : Number(match[2])
  if (!Number.isFinite(additionalPriceYuan) || additionalPriceYuan < 0) return null
  return {
    name: asDomainText<DisplayText>(name),
    additionalPriceCents: asDomainNumber<CurrencyCents>(Math.round(additionalPriceYuan * CURRENCY_CENTS_SCALE)),
  }
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
    return invalidSelectionGroups()
  }

  const groups: MenuItemSelectionGroup[] = []
  const usedNames: DisplayText[] = []

  for (const line of lines) {
    const [leftPart, rightPart, ...rest] = line.split(':')
    if (!leftPart || !rightPart || rest.length > 0) {
      return invalidSelectionGroups()
    }
    const nameRuleMatch = leftPart.trim().match(/^([^[\]]+?)(\[\d+-\d+\])?$/)
    if (!nameRuleMatch) {
      return invalidSelectionGroups()
    }
    const name = normalizeSelectionLinePart(nameRuleMatch[1] ?? '', MAX_MENU_ITEM_SELECTION_GROUP_NAME_LENGTH)
    const range = parseSelectionCountRange(nameRuleMatch[2] ?? '')
    const options = rightPart
      .split(',')
      .map(parseSelectionOption)
      .filter((option): option is MenuItemSelectionOption => option !== null)
    const optionNames = options.map((option) => option.name)

    if (
      !name ||
      usedNames.includes(asDomainText<DisplayText>(name)) ||
      !range.ok ||
      options.length === 0 ||
      options.length > MAX_MENU_ITEM_SELECTION_OPTION_COUNT ||
      optionNames.some((optionName, index) => optionNames.indexOf(optionName) !== index) ||
      range.maxSelections === 0 ||
      range.maxSelections > options.length ||
      range.minSelections > options.length
    ) {
      return invalidSelectionGroups()
    }

    usedNames.push(asDomainText<DisplayText>(name))
    groups.push({
      name: asDomainText<DisplayText>(name),
      minSelections: asDomainNumber<EntityCount>(range.minSelections),
      maxSelections: asDomainNumber<EntityCount>(range.maxSelections),
      options,
    })
  }

  return { groups, errorText: null }
}

function invalidSelectionGroups(): ParsedMenuItemSelectionGroups {
  return {
    groups: [],
    errorText: asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemSelectionGroupsInvalid),
  }
}

export function buildPartialRefundResolutionPayload(
  approved: boolean,
  resolutionNote: string,
): ResolvePartialRefundRequest {
  return {
    approved: asDomainBoolean(approved),
    resolutionNote:
      optionalDomainText<ResolutionText>(normalizeTextInput(resolutionNote, MAX_TICKET_NOTE_LENGTH)) ||
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
    approved: asDomainBoolean(approved),
    resolutionNote:
      optionalDomainText<ResolutionText>(normalizeTextInput(nextDraft.resolutionNote, MAX_TICKET_NOTE_LENGTH)) ||
      (approved ? AFTER_SALES_APPROVED_NOTE : AFTER_SALES_REJECTED_NOTE),
    resolutionMode: approved
      ? nextDraft.resolutionMode
      : AFTER_SALES_RESOLUTION_MODE.manual,
    actualCompensationCents: actualCompensationCents == null
      ? undefined
      : asDomainNumber<CurrencyCents>(actualCompensationCents),
  }
}

export function buildMerchantProfilePayload(
  draft: MerchantProfileDraft,
): UpdateMerchantProfileRequest {
  return {
    contactPhone: asDomainText<PhoneNumber>(normalizeTextInput(draft.contactPhone, MAX_CONTACT_PHONE_LENGTH)),
    payoutAccount: {
      accountType: draft.payoutAccountType,
      bankName:
        draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
          ? optionalDomainText<BankName>(normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH))
          : undefined,
      accountNumber: asDomainText<AccountNumber>(normalizeTextInput(draft.accountNumber, MAX_ACCOUNT_NUMBER_LENGTH)),
      accountHolder: asDomainText<AccountHolderName>(normalizeTextInput(draft.accountHolder, MAX_ACCOUNT_HOLDER_LENGTH)),
    },
  }
}

export function buildMerchantWithdrawPayload(
  amountYuan: number,
): WithdrawMerchantIncomeRequest {
  return { amountCents: asDomainNumber<CurrencyCents>(Math.round(amountYuan * CURRENCY_CENTS_SCALE)) }
}

export function parseMerchantWithdrawAmount(value: string) {
  return parseCurrencyAmount(value)
}

function optionalDomainText<T extends string>(value: string): T | undefined {
  return value ? asDomainText<T>(value) : undefined
}
