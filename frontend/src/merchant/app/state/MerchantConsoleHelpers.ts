import type { Dispatch, SetStateAction } from 'react'
import { deliveryApi } from '@/shared/api/SharedApi'
import type { MenuItem, Store } from '@/shared/object/core/SharedObjects'
import {
  DELIVERY_CONSOLE_MESSAGES,
  CURRENCY_CENTS_SCALE,
  CURRENCY_DECIMAL_PLACES,
  MAX_MENU_ITEM_PRICE_CENTS,
  MAX_MENU_ITEM_STOCK,
  MAX_PREP_MINUTES,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MIN_MENU_ITEM_STOCK,
  MIN_PREP_MINUTES,
  MINUTES_PER_HOUR,
  isValidBusinessTime,
  normalizeWhitespace,
} from '@/shared/delivery/DeliveryServices'
import type {
  MerchantConsoleStateArgs,
  StoreOperationDraft,
  StoreOperationErrors,
} from '@/merchant/object/console/MerchantConsoleObjects'

export function buildStoreOperationDraft(store: Store): StoreOperationDraft {
  return {
    openTime: store.businessHours.openTime,
    closeTime: store.businessHours.closeTime,
    avgPrepMinutes: String(store.avgPrepMinutes),
  }
}

function businessTimeToMinutes(value: string) {
  if (!isValidBusinessTime(value)) return Number.NaN
  const [hours, minutes] = value.split(':').map(Number)
  if (hours == null || minutes == null) return Number.NaN
  return hours * MINUTES_PER_HOUR + minutes
}

export function validateStoreOperationDraft(draft: StoreOperationDraft): StoreOperationErrors {
  const avgPrepMinutes = Number(draft.avgPrepMinutes.trim())
  const businessHoursError =
    !isValidBusinessTime(draft.openTime) || !isValidBusinessTime(draft.closeTime)
      ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursInvalid
      : businessTimeToMinutes(draft.openTime) >= businessTimeToMinutes(draft.closeTime)
        ? DELIVERY_CONSOLE_MESSAGES.merchant.businessHoursOrderInvalid
        : undefined

  return {
    openTime: businessHoursError,
    closeTime: businessHoursError,
    avgPrepMinutes:
      Number.isInteger(avgPrepMinutes) &&
      avgPrepMinutes >= MIN_PREP_MINUTES &&
      avgPrepMinutes <= MAX_PREP_MINUTES
        ? undefined
        : DELIVERY_CONSOLE_MESSAGES.merchant.prepMinutesInvalid,
  }
}

export function createMerchantConsoleSelectors({
  menuItemPriceDrafts,
  menuItemStockDrafts,
  orderRejectDrafts,
  orderRejectErrors,
  storeOperationDrafts,
}: {
  menuItemPriceDrafts: Record<string, string>
  menuItemStockDrafts: Record<string, string>
  orderRejectDrafts: Record<string, string>
  orderRejectErrors: Record<string, string>
  storeOperationDrafts: Record<string, StoreOperationDraft>
}) {
  function getMenuItemStockDraft(item: MenuItem) {
    return menuItemStockDrafts[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getMenuItemPriceDraft(item: MenuItem) {
    return menuItemPriceDrafts[item.id] ?? (item.priceCents / CURRENCY_CENTS_SCALE).toFixed(CURRENCY_DECIMAL_PLACES)
  }

  function getOrderRejectDraft(orderId: string) {
    return orderRejectDrafts[orderId] ?? ''
  }

  function getOrderRejectError(orderId: string) {
    return orderRejectErrors[orderId] ?? ''
  }

  function getStoreOperationDraft(store: Store): StoreOperationDraft {
    return storeOperationDrafts[store.id] ?? buildStoreOperationDraft(store)
  }

  return {
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
    if (!Number.isInteger(parsed) || parsed < MIN_MENU_ITEM_STOCK || parsed > MAX_MENU_ITEM_STOCK) {
      return DELIVERY_CONSOLE_MESSAGES.merchant.stockQuantityInvalid
    }
    return null
  }

  function getMenuItemPriceError(value: string) {
    const trimmed = value.trim()
    const parsed = Number(trimmed)
    const priceCents = Number.isFinite(parsed) ? Math.round(parsed * CURRENCY_CENTS_SCALE) : 0
    if (!Number.isFinite(parsed) || priceCents <= 0 || priceCents > MAX_MENU_ITEM_PRICE_CENTS) {
      return DELIVERY_CONSOLE_MESSAGES.merchant.menuItemPriceUpdateInvalid
    }
    return null
  }

  return { getMenuItemPriceError, getMenuItemStockError }
}

export function createMerchantConsoleActions({
  getMenuItemPriceDraft,
  getMenuItemPriceError,
  getMenuItemStockDraft,
  getMenuItemStockError,
  getOrderRejectDraft,
  getStoreOperationDraft,
  runAction,
  setMenuItemPriceDrafts,
  setMenuItemStockDrafts,
  setOrderRejectDrafts,
  setOrderRejectErrors,
  setStoreOperationErrors,
}: Pick<MerchantConsoleStateArgs, 'runAction'> & {
  getMenuItemPriceDraft: (item: MenuItem) => string
  getMenuItemPriceError: (value: string) => string | null
  getMenuItemStockDraft: (item: MenuItem) => string
  getMenuItemStockError: (value: string) => string | null
  getOrderRejectDraft: (orderId: string) => string
  getStoreOperationDraft: (store: Store) => StoreOperationDraft
  setMenuItemPriceDrafts: Dispatch<SetStateAction<Record<string, string>>>
  setMenuItemStockDrafts: Dispatch<SetStateAction<Record<string, string>>>
  setOrderRejectDrafts: Dispatch<SetStateAction<Record<string, string>>>
  setOrderRejectErrors: Dispatch<SetStateAction<Record<string, string>>>
  setStoreOperationErrors: Dispatch<SetStateAction<Record<string, StoreOperationErrors>>>
}) {
  async function submitMenuItemStock(storeId: string, item: MenuItem) {
    const draft = getMenuItemStockDraft(item)
    if (getMenuItemStockError(draft)) return
    const trimmed = draft.trim()
    const success = await runAction(() =>
      deliveryApi.merchant.updateStoreMenuItemStock(storeId, item.id, {
        remainingQuantity: trimmed === '' ? undefined : Number(trimmed),
      }),
    )
    if (!success) return
    setMenuItemStockDrafts((current) => ({ ...current, [item.id]: trimmed }))
  }

  async function submitMenuItemPrice(storeId: string, item: MenuItem) {
    const draft = getMenuItemPriceDraft(item)
    if (getMenuItemPriceError(draft)) return
    const priceCents = Math.round(Number(draft.trim()) * CURRENCY_CENTS_SCALE)
    const success = await runAction(() =>
      deliveryApi.merchant.updateStoreMenuItemPrice(storeId, item.id, { priceCents }),
    )
    if (!success) return
    setMenuItemPriceDrafts((current) => ({
      ...current,
      [item.id]: (priceCents / CURRENCY_CENTS_SCALE).toFixed(CURRENCY_DECIMAL_PLACES),
    }))
  }

  async function submitOrderReject(orderId: string) {
    const reason = normalizeWhitespace(getOrderRejectDraft(orderId)).trim().slice(0, MAX_REJECT_ORDER_REASON_LENGTH)
    if (!reason) {
      setOrderRejectErrors((current) => ({ ...current, [orderId]: DELIVERY_CONSOLE_MESSAGES.merchant.orderRejectReasonRequired }))
      return
    }
    setOrderRejectErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })
    const success = await runAction(() => deliveryApi.order.rejectOrder(orderId, { reason }))
    if (!success) return
    setOrderRejectDrafts((current) => ({ ...current, [orderId]: '' }))
  }

  async function submitStoreOperationalInfo(store: Store) {
    const draft = getStoreOperationDraft(store)
    const errors = validateStoreOperationDraft(draft)
    if (errors.openTime || errors.closeTime || errors.avgPrepMinutes) {
      setStoreOperationErrors((current) => ({ ...current, [store.id]: errors }))
      return
    }
    const success = await runAction(() =>
      deliveryApi.merchant.updateStoreOperationalInfo(store.id, {
        businessHours: { openTime: draft.openTime, closeTime: draft.closeTime },
        avgPrepMinutes: Number(draft.avgPrepMinutes.trim()),
      }),
    )
    if (!success) return
    setStoreOperationErrors((current) => {
      const next = { ...current }
      delete next[store.id]
      return next
    })
  }

  async function clearMenuItemStockLimit(storeId: string, item: MenuItem) {
    const success = await runAction(() =>
      deliveryApi.merchant.updateStoreMenuItemStock(storeId, item.id, {
        remainingQuantity: undefined,
      }),
    )
    if (!success) return
    setMenuItemStockDrafts((current) => ({ ...current, [item.id]: '' }))
  }

  return {
    clearMenuItemStockLimit,
    submitMenuItemPrice,
    submitMenuItemStock,
    submitOrderReject,
    submitStoreOperationalInfo,
  }
}
