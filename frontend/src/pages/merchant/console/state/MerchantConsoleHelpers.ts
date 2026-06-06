import type { Dispatch, SetStateAction } from 'react'
import {
  rejectOrder,
  updateMenuItemCategory,
  updateMenuItemPrice,
  updateMenuItemStock,
  updateStoreOperationalInfo,
} from '@/system/api/SharedApi'
import type {
  DisplayText,
  CurrencyCents,
  AddressText,
  MenuItem,
  OrderId,
  Quantity,
  ReasonText,
  Minutes,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import { asDomainNumber, asDomainText } from '@/features/delivery/DeliveryShared'
import {
  DELIVERY_CONSOLE_MESSAGES,
  CURRENCY_CENTS_SCALE,
  CURRENCY_DECIMAL_PLACES,
  MAX_MENU_ITEM_CATEGORY_LENGTH,
  MAX_MENU_ITEM_PRICE_CENTS,
  MAX_MENU_ITEM_STOCK,
  MAX_PREP_MINUTES,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MIN_MENU_ITEM_STOCK,
  MIN_PREP_MINUTES,
  MINUTES_PER_HOUR,
  isValidBusinessTime,
  normalizeWhitespace,
} from '@/features/delivery/DeliveryServices'
import { geocodeDeliveryAddress } from '@/features/delivery/DeliveryGeocoding'
import type {
  MenuItemCategoryDraftMap,
  MenuItemPriceDraftMap,
  MenuItemStockDraftMap,
  MerchantConsoleStateArgs,
  OrderRejectDraftMap,
  StoreOperationDraft,
  StoreOperationDraftMap,
  StoreOperationErrorMap,
  StoreOperationErrors,
} from '@/pages/merchant/objects/MerchantConsoleObjects'

function toDisplayText(value: string) {
  return asDomainText<DisplayText>(value)
}

export function buildStoreOperationDraft(store: Store): StoreOperationDraft {
  return {
    storeAddress: store.storeAddress,
    openTime: store.businessHours.openTime,
    closeTime: store.businessHours.closeTime,
    avgPrepMinutes: toDisplayText(String(store.avgPrepMinutes)),
  }
}

function businessTimeToMinutes(value: string) {
  if (!isValidBusinessTime(value)) return Number.NaN
  const [hours, minutes] = value.split(':').map(Number)
  if (hours == null || minutes == null) return Number.NaN
  return hours * MINUTES_PER_HOUR + minutes
}

export function validateStoreOperationDraft(draft: StoreOperationDraft): StoreOperationErrors {
  const storeAddress = normalizeWhitespace(draft.storeAddress).trim()
  const avgPrepMinutes = Number(draft.avgPrepMinutes.trim())
  const businessHoursError =
    !isValidBusinessTime(draft.openTime) || !isValidBusinessTime(draft.closeTime)
      ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursInvalid
      : businessTimeToMinutes(draft.openTime) >= businessTimeToMinutes(draft.closeTime)
        ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursOrderInvalid
        : undefined

  return {
    storeAddress: storeAddress ? undefined : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.storeAddressRequired),
    openTime: businessHoursError ? toDisplayText(businessHoursError) : undefined,
    closeTime: businessHoursError ? toDisplayText(businessHoursError) : undefined,
    avgPrepMinutes:
      Number.isInteger(avgPrepMinutes) &&
      avgPrepMinutes >= MIN_PREP_MINUTES &&
      avgPrepMinutes <= MAX_PREP_MINUTES
        ? undefined
        : toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.prepMinutesInvalid),
  }
}

export function createMerchantConsoleSelectors({
  menuItemCategoryDrafts,
  menuItemPriceDrafts,
  menuItemStockDrafts,
  orderRejectDrafts,
  orderRejectErrors,
  storeOperationDrafts,
}: {
  menuItemCategoryDrafts: MenuItemCategoryDraftMap
  menuItemPriceDrafts: MenuItemPriceDraftMap
  menuItemStockDrafts: MenuItemStockDraftMap
  orderRejectDrafts: OrderRejectDraftMap
  orderRejectErrors: OrderRejectDraftMap
  storeOperationDrafts: StoreOperationDraftMap
}) {
  function getMenuItemStockDraft(item: MenuItem) {
    return menuItemStockDrafts[item.id] ?? toDisplayText(item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getMenuItemCategoryDraft(item: MenuItem) {
    return menuItemCategoryDrafts[item.id] ?? toDisplayText(item.category ?? '')
  }

  function getMenuItemPriceDraft(item: MenuItem) {
    return menuItemPriceDrafts[item.id] ?? toDisplayText((item.priceCents / CURRENCY_CENTS_SCALE).toFixed(CURRENCY_DECIMAL_PLACES))
  }

  function getOrderRejectDraft(orderId: OrderId) {
    return orderRejectDrafts[orderId] ?? toDisplayText('')
  }

  function getOrderRejectError(orderId: OrderId) {
    return orderRejectErrors[orderId] ?? toDisplayText('')
  }

  function getStoreOperationDraft(store: Store): StoreOperationDraft {
    return storeOperationDrafts[store.id] ?? buildStoreOperationDraft(store)
  }

  return {
    getMenuItemCategoryDraft,
    getMenuItemPriceDraft,
    getMenuItemStockDraft,
    getOrderRejectDraft,
    getOrderRejectError,
    getStoreOperationDraft,
  }
}

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

export function createMerchantConsoleActions({
  getMenuItemCategoryDraft,
  getMenuItemCategoryError,
  getMenuItemPriceDraft,
  getMenuItemPriceError,
  getMenuItemStockDraft,
  getMenuItemStockError,
  getOrderRejectDraft,
  getStoreOperationDraft,
  runAction,
  setMenuItemCategoryDrafts,
  setMenuItemPriceDrafts,
  setMenuItemStockDrafts,
  setOrderRejectDrafts,
  setOrderRejectErrors,
  setStoreOperationErrors,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getMenuItemCategoryDraft: (item: MenuItem) => DisplayText
  getMenuItemCategoryError: (value: DisplayText) => string | null
  getMenuItemPriceDraft: (item: MenuItem) => DisplayText
  getMenuItemPriceError: (value: DisplayText) => string | null
  getMenuItemStockDraft: (item: MenuItem) => DisplayText
  getMenuItemStockError: (value: DisplayText) => string | null
  getOrderRejectDraft: (orderId: OrderId) => DisplayText
  getStoreOperationDraft: (store: Store) => StoreOperationDraft
  setMenuItemCategoryDrafts: Dispatch<SetStateAction<MenuItemCategoryDraftMap>>
  setMenuItemPriceDrafts: Dispatch<SetStateAction<MenuItemPriceDraftMap>>
  setMenuItemStockDrafts: Dispatch<SetStateAction<MenuItemStockDraftMap>>
  setOrderRejectDrafts: Dispatch<SetStateAction<OrderRejectDraftMap>>
  setOrderRejectErrors: Dispatch<SetStateAction<OrderRejectDraftMap>>
  setStoreOperationErrors: Dispatch<SetStateAction<StoreOperationErrorMap>>
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

  async function submitOrderReject(orderId: OrderId) {
    const reason = normalizeWhitespace(getOrderRejectDraft(orderId)).trim().slice(0, MAX_REJECT_ORDER_REASON_LENGTH)
    if (!reason) {
      setOrderRejectErrors((current) => ({ ...current, [orderId]: toDisplayText(DELIVERY_CONSOLE_MESSAGES.merchant.orderRejectReasonRequired) }))
      return
    }
    setOrderRejectErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })
    const success = await runAction(() => rejectOrder(orderId, { reason: asDomainText<ReasonText>(reason) }))
    if (!success) return
    setOrderRejectDrafts((current) => ({ ...current, [orderId]: toDisplayText('') }))
  }

  async function submitStoreOperationalInfo(store: Store) {
    const draft = getStoreOperationDraft(store)
    const errors = validateStoreOperationDraft(draft)
    if (errors.storeAddress || errors.openTime || errors.closeTime || errors.avgPrepMinutes) {
      setStoreOperationErrors((current) => ({ ...current, [store.id]: errors }))
      return
    }
    const storeAddress = normalizeWhitespace(draft.storeAddress).trim()
    const location = await geocodeDeliveryAddress(storeAddress)
    if (!location) {
      setStoreOperationErrors((current) => ({
        ...current,
        [store.id]: {
          ...errors,
          storeAddress: toDisplayText(DELIVERY_CONSOLE_MESSAGES.profile.addressLocationRequired),
        },
      }))
      return
    }
    const success = await runAction(() =>
      updateStoreOperationalInfo(store.id, {
        storeAddress: asDomainText<AddressText>(storeAddress),
        location,
        businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
        avgPrepMinutes: asDomainNumber<Minutes>(Number(draft.avgPrepMinutes.trim())),
      }),
    )
    if (!success) return
    setStoreOperationErrors((current) => {
      const next = { ...current }
      delete next[store.id]
      return next
    })
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
    submitOrderReject,
    submitStoreOperationalInfo,
  }
}
