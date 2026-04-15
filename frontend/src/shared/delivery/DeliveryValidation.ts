import { PAYOUT_ACCOUNT_TYPE } from '@/shared/object/SharedObjects'
import type {
  CustomerAddressDraft,
  CustomerAddressField,
  MenuItemDraft,
  MenuItemFormField,
  MerchantDraft,
  MerchantFormField,
  MerchantProfileDraft,
  MerchantProfileFormField,
} from '@/shared/delivery-app/DeliveryAppObjects'
import {
  MAX_ACCOUNT_HOLDER_LENGTH,
  MAX_ACCOUNT_NUMBER_LENGTH,
  MAX_BANK_NAME_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
  MAX_MENU_ITEM_PRICE_CENTS,
  MAX_MENU_ITEM_STOCK,
  MAX_MERCHANT_NAME_LENGTH,
  MAX_STORE_CATEGORY_LENGTH,
  MAX_STORE_NAME_LENGTH,
  MIN_MENU_ITEM_QUANTITY,
} from './DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from './DeliveryMessages'
import { buildCustomerAddressPayload, buildMenuItemPayload } from './DeliveryPayloads'
import { validateBusinessHours } from './DeliverySchedule'
import { isValidContactPhone, normalizeTextInput } from './DeliveryShared'

export function validateMerchantDraft(draft: MerchantDraft): Partial<Record<MerchantFormField, string>> {
  const merchantName = normalizeTextInput(draft.merchantName, MAX_MERCHANT_NAME_LENGTH)
  const storeName = normalizeTextInput(draft.storeName, MAX_STORE_NAME_LENGTH)
  const category = normalizeTextInput(draft.category, MAX_STORE_CATEGORY_LENGTH)
  const imageUrl = draft.imageUrl.trim()
  const businessHoursError = validateBusinessHours({
    openTime: draft.openTime,
    closeTime: draft.closeTime,
  })

  return {
    merchantName: merchantName ? undefined : DELIVERY_CONSOLE_MESSAGES.merchantNameRequired,
    storeName: storeName ? undefined : DELIVERY_CONSOLE_MESSAGES.storeNameRequired,
    category: category ? undefined : DELIVERY_CONSOLE_MESSAGES.storeCategoryRequired,
    openTime: businessHoursError,
    closeTime: businessHoursError,
    imageUrl: imageUrl ? undefined : DELIVERY_CONSOLE_MESSAGES.storeImageRequired,
  }
}

export function validateMenuItemDraft(draft: MenuItemDraft): Partial<Record<MenuItemFormField, string>> {
  const payload = buildMenuItemPayload(draft)
  const price = Number(draft.priceYuan.trim())
  const remainingQuantityText = draft.remainingQuantity.trim()
  const parsedRemainingQuantity = Number(remainingQuantityText)
  const hasValidRemainingQuantity =
    remainingQuantityText === '' ||
    (Number.isInteger(parsedRemainingQuantity) &&
      parsedRemainingQuantity >= MIN_MENU_ITEM_QUANTITY &&
      parsedRemainingQuantity <= MAX_MENU_ITEM_STOCK)

  return {
    name: payload.name ? undefined : DELIVERY_CONSOLE_MESSAGES.menuItemNameRequired,
    description: payload.description ? undefined : DELIVERY_CONSOLE_MESSAGES.menuItemDescriptionRequired,
    priceYuan:
      Number.isFinite(price) &&
      payload.priceCents > 0 &&
      payload.priceCents <= MAX_MENU_ITEM_PRICE_CENTS
        ? undefined
        : DELIVERY_CONSOLE_MESSAGES.menuItemPriceInvalid,
    remainingQuantity: hasValidRemainingQuantity ? undefined : DELIVERY_CONSOLE_MESSAGES.menuItemRemainingQuantityInvalid,
    imageUrl: payload.imageUrl ? undefined : DELIVERY_CONSOLE_MESSAGES.menuItemImageRequired,
  }
}

export function validateCustomerAddressDraft(draft: CustomerAddressDraft): Partial<Record<CustomerAddressField, string>> {
  const payload = buildCustomerAddressPayload(draft)
  return {
    label: payload.label ? undefined : DELIVERY_CONSOLE_MESSAGES.addressLabelRequired,
    address: payload.address ? undefined : DELIVERY_CONSOLE_MESSAGES.addressContentRequired,
  }
}

export function validateMerchantProfileDraft(draft: MerchantProfileDraft): Partial<Record<MerchantProfileFormField, string>> {
  const contactPhone = normalizeTextInput(draft.contactPhone, MAX_CONTACT_PHONE_LENGTH)
  const bankName = normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH)
  const accountNumber = normalizeTextInput(draft.accountNumber, MAX_ACCOUNT_NUMBER_LENGTH)
  const accountHolder = normalizeTextInput(draft.accountHolder, MAX_ACCOUNT_HOLDER_LENGTH)

  return {
    contactPhone:
      !contactPhone
        ? DELIVERY_CONSOLE_MESSAGES.contactPhoneRequired
        : isValidContactPhone(contactPhone)
          ? undefined
          : DELIVERY_CONSOLE_MESSAGES.contactPhoneInvalid,
    bankName: draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank ? (bankName ? undefined : DELIVERY_CONSOLE_MESSAGES.bankNameRequired) : undefined,
    accountNumber: accountNumber
      ? undefined
      : draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
        ? DELIVERY_CONSOLE_MESSAGES.bankCardNumberRequired
        : DELIVERY_CONSOLE_MESSAGES.alipayAccountRequired,
    accountHolder: accountHolder
      ? undefined
      : draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
        ? DELIVERY_CONSOLE_MESSAGES.bankAccountHolderRequired
        : DELIVERY_CONSOLE_MESSAGES.genericAccountHolderRequired,
  }
}

export function getMerchantFieldId(field: MerchantFormField) {
  return `merchant-application-${field}`
}

export function getMenuItemFieldId(storeId: string, field: MenuItemFormField) {
  return `store-menu-${storeId}-${field}`
}

export function getMerchantFieldClassName(hasError: boolean, className = '') {
  return [className, hasError ? 'field-error' : ''].filter(Boolean).join(' ')
}
