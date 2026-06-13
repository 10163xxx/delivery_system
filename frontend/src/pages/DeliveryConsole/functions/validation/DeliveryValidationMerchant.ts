import { PAYOUT_ACCOUNT_TYPE, type DisplayText } from '@/objects/core/SharedObjects'
import type { MenuItemDraft, MerchantDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type {
  MenuItemFormField,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import {
  MAX_ACCOUNT_HOLDER_LENGTH,
  MAX_ACCOUNT_NUMBER_LENGTH,
  MAX_BANK_NAME_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_MENU_ITEM_CATEGORY_LENGTH,
  MAX_MENU_ITEM_PRICE_CENTS,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MIN_MENU_ITEM_QUANTITY,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { buildMenuItemPayload, parseMenuItemSelectionGroups } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloads'
import { validateBusinessHours } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { asDomainText, isValidContactPhone, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

function toDisplayText(value: string | undefined) {
  return value === undefined ? undefined : asDomainText<DisplayText>(value)
}

export function validateMerchantDraft(
  draft: MerchantDraft,
): Partial<Record<MerchantFormField, DisplayText>> {
  const merchantName = normalizeTextInput(
    draft.merchantName,
    MAX_MERCHANT_NAME_LENGTH,
  )
  const storeName = normalizeTextInput(draft.storeName, MAX_STORE_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_STORE_CATEGORY_LENGTH)
  const storeAddress = normalizeTextInput(draft.storeAddress, MAX_ADDRESS_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const businessHoursError = validateBusinessHours({
    openTime: draft.openTime,
    closeTime: draft.closeTime,
  })

  return {
    merchantName: merchantName
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.merchantNameRequired),
    storeName: storeName
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeNameRequired),
    category: category
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeCategoryRequired),
    storeAddress: storeAddress
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeAddressRequired),
    openTime: toDisplayText(businessHoursError),
    closeTime: toDisplayText(businessHoursError),
    imageUrl: imageUrl
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeImageRequired),
  }
}

export function validateMenuItemDraft(
  draft: MenuItemDraft,
): Partial<Record<MenuItemFormField, DisplayText>> {
  const payload = buildMenuItemPayload(draft)
  const category = normalizeTextInput(draft.category, MAX_MENU_ITEM_CATEGORY_LENGTH)
  const price = Number(draft.priceYuan.trim())
  const remainingQuantityText = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantityText)
  const hasValidRemainingQuantity =
    remainingQuantityText === '' ||
    (Number.isInteger(parsedRemainingQuantity) &&
      parsedRemainingQuantity >= MIN_MENU_ITEM_QUANTITY)

  const selectionGroupParseResult = parseMenuItemSelectionGroups(draft.selectionGroupsText)

  return {
    name: payload.name
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemNameRequired),
    category: category
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemCategoryRequired),
    description: payload.description
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemDescriptionRequired),
    priceYuan:
      Number.isFinite(price) &&
      payload.priceCents > 0 &&
      payload.priceCents <= MAX_MENU_ITEM_PRICE_CENTS
        ? undefined
        : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemPriceInvalid),
    remainingQuantity: hasValidRemainingQuantity
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemRemainingQuantityInvalid),
    imageUrl: payload.imageUrl
      ? undefined
      : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemImageRequired),
    selectionGroupsText: toDisplayText(selectionGroupParseResult.errorText ?? undefined),
  }
}

export function validateMerchantProfileDraft(
  draft: MerchantProfileDraft,
): Partial<Record<MerchantProfileFormField, DisplayText>> {
  const contactPhone = normalizeTextInput(
    draft.contactPhone,
    MAX_CONTACT_PHONE_LENGTH,
  )
  const bankName = normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH)
  const accountNumber = normalizeTextInput(
    draft.accountNumber,
    MAX_ACCOUNT_NUMBER_LENGTH,
  )
  const accountHolder = normalizeTextInput(
    draft.accountHolder,
    MAX_ACCOUNT_HOLDER_LENGTH,
  )

  return {
    contactPhone:
      !contactPhone
        ? toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.contactPhoneRequired)
        : isValidContactPhone(contactPhone)
          ? undefined
          : toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.contactPhoneInvalid),
    bankName:
      draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
        ? bankName
          ? undefined
          : toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.bankNameRequired)
        : undefined,
    accountNumber: accountNumber
      ? undefined
      : draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
        ? toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.bankCardNumberRequired)
        : toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.alipayAccountRequired),
    accountHolder: accountHolder
      ? undefined
      : draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
        ? toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.bankAccountHolderRequired)
        : toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.genericAccountHolderRequired),
  }
}
