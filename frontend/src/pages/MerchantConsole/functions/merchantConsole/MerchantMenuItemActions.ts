import type { Dispatch, SetStateAction } from 'react'
import {
  updateMenuItemCategory,
  updateMenuItemPrice,
  updateMenuItemStock,
} from '@/system/api/SharedApi'
import type {
  CurrencyCents,
  DisplayText,
  MenuItem,
  Quantity,
  StoreId,
} from '@/objects/core/SharedObjects'
import { asDomainNumber } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import {
  CURRENCY_CENTS_SCALE,
  CURRENCY_DECIMAL_PLACES,
  MAX_MENU_ITEM_STOCK,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { normalizeWhitespace } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type {
  MerchantConsoleStateArgs,
  MenuItemCategoryDraftMap,
  MenuItemPriceDraftMap,
  MenuItemStockDraftMap,
} from '@/pages/MerchantConsole/objects/MerchantConsoleObjects'
import { toDisplayText } from '@/pages/MerchantConsole/functions/merchantConsole/MerchantConsoleValueHelpers'

export function createMenuItemUpdateActions({
  getMenuItemCategoryDraft,
  getMenuItemCategoryError,
  getMenuItemPriceDraft,
  getMenuItemPriceError,
  getMenuItemStockDraft,
  getMenuItemStockError,
  runAction,
  setMenuItemCategoryDrafts,
  setMenuItemPriceDrafts,
  setMenuItemStockDrafts,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getMenuItemCategoryDraft: (item: MenuItem) => DisplayText
  getMenuItemCategoryError: (value: DisplayText) => string | null
  getMenuItemPriceDraft: (item: MenuItem) => DisplayText
  getMenuItemPriceError: (value: DisplayText) => string | null
  getMenuItemStockDraft: (item: MenuItem) => DisplayText
  getMenuItemStockError: (value: DisplayText) => string | null
  setMenuItemCategoryDrafts: Dispatch<SetStateAction<MenuItemCategoryDraftMap>>
  setMenuItemPriceDrafts: Dispatch<SetStateAction<MenuItemPriceDraftMap>>
  setMenuItemStockDrafts: Dispatch<SetStateAction<MenuItemStockDraftMap>>
}) {
  async function submitMenuItemStock(storeId: StoreId, item: MenuItem) {
    const draft = getMenuItemStockDraft(item)
    if (getMenuItemStockError(draft)) return
    const trimmed = draft.trim()
    const success = await runAction(() =>
      updateMenuItemStock(storeId, item.id, {
        remainingQuantity:
          trimmed === '' || Number(trimmed) > MAX_MENU_ITEM_STOCK
            ? undefined
            : asDomainNumber<Quantity>(Number(trimmed)),
      }),
    )
    if (!success) return
    setMenuItemStockDrafts((current) => ({
      ...current,
      [item.id]: toDisplayText(trimmed === '' || Number(trimmed) > MAX_MENU_ITEM_STOCK ? '' : trimmed),
    }))
  }

  async function submitMenuItemPrice(storeId: StoreId, item: MenuItem) {
    const draft = getMenuItemPriceDraft(item)
    if (getMenuItemPriceError(draft)) return
    const priceCents = Math.round(Number(draft.trim()) * CURRENCY_CENTS_SCALE)
    const success = await runAction(() =>
      updateMenuItemPrice(storeId, item.id, { priceCents: asDomainNumber<CurrencyCents>(priceCents) }),
    )
    if (!success) return
    setMenuItemPriceDrafts((current) => ({
      ...current,
      [item.id]: toDisplayText((priceCents / CURRENCY_CENTS_SCALE).toFixed(CURRENCY_DECIMAL_PLACES)),
    }))
  }

  async function submitMenuItemCategory(storeId: StoreId, item: MenuItem) {
    const category = normalizeWhitespace(getMenuItemCategoryDraft(item)).trim()
    const categoryText = toDisplayText(category)
    if (getMenuItemCategoryError(categoryText)) return
    const success = await runAction(() =>
      updateMenuItemCategory(storeId, item.id, { category: categoryText }),
    )
    if (!success) return
    setMenuItemCategoryDrafts((current) => ({ ...current, [item.id]: categoryText }))
  }

  async function clearMenuItemStockLimit(storeId: StoreId, item: MenuItem) {
    const success = await runAction(() =>
      updateMenuItemStock(storeId, item.id, {
        remainingQuantity: undefined,
      }),
    )
    if (!success) return
    setMenuItemStockDrafts((current) => ({ ...current, [item.id]: toDisplayText('') }))
  }

  return {
    clearMenuItemStockLimit,
    submitMenuItemCategory,
    submitMenuItemPrice,
    submitMenuItemStock,
  }
}
