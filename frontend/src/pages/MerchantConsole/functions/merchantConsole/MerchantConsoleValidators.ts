import {
  MAX_MENU_ITEM_CATEGORY_LENGTH,
  MAX_MENU_ITEM_PRICE_CENTS,
  MIN_MENU_ITEM_STOCK,
  CURRENCY_CENTS_SCALE,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { normalizeWhitespace } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { toDisplayText } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValueHelpers'

export function createMerchantConsoleValidators() {
  function getMenuItemStockError(value: string) {
    const trimmed = value.trim()
    if (trimmed === '') return null
    const parsed = Number(trimmed)
    if (!Number.isInteger(parsed) || parsed < MIN_MENU_ITEM_STOCK) {
      return toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.stockQuantityInvalid)
    }
    return null
  }

  function getMenuItemPriceError(value: string) {
    const trimmed = value.trim()
    const parsed = Number(trimmed)
    const priceCents = Number.isFinite(parsed) ? Math.round(parsed * CURRENCY_CENTS_SCALE) : 0
    if (!Number.isFinite(parsed) || priceCents <= 0 || priceCents > MAX_MENU_ITEM_PRICE_CENTS) {
      return toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemPriceUpdateInvalid)
    }
    return null
  }

  function getMenuItemCategoryError(value: string) {
    const trimmed = normalizeWhitespace(value).trim()
    if (!trimmed) return toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemCategoryRequired)
    if (trimmed.length > MAX_MENU_ITEM_CATEGORY_LENGTH) {
      return toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.menuItemCategoryInvalid)
    }
    return null
  }

  return { getMenuItemCategoryError, getMenuItemPriceError, getMenuItemStockError }
}
