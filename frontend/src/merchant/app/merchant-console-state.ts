import { useState } from 'react'
import {
  rejectOrder,
  updateStoreMenuItemPrice,
  updateStoreMenuItemStock,
  updateStoreOperationalInfo,
} from '@/shared/api'
import type { MerchantRoleProps } from '@/shared/app-build-role-props'
import type { MenuItem, Store } from '@/shared/object'
import {
  DELIVERY_CONSOLE_MESSAGES,
  CURRENCY_CENTS_SCALE,
  MAX_MENU_ITEM_PRICE_CENTS,
  MAX_MENU_ITEM_STOCK,
  MAX_PREP_MINUTES,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MIN_MENU_ITEM_STOCK,
  MIN_PREP_MINUTES,
  MINUTES_PER_HOUR,
  isValidBusinessTime,
  normalizeWhitespace,
} from '@/shared/delivery'

type StoreOperationDraft = {
  openTime: string
  closeTime: string
  avgPrepMinutes: string
}

type StoreOperationErrors = {
  openTime?: string
  closeTime?: string
  avgPrepMinutes?: string
}

function buildStoreOperationDraft(store: Store): StoreOperationDraft {
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

function validateStoreOperationDraft(draft: StoreOperationDraft): StoreOperationErrors {
  const avgPrepMinutes = Number(draft.avgPrepMinutes.trim())
  const businessHoursError =
    !isValidBusinessTime(draft.openTime) || !isValidBusinessTime(draft.closeTime)
      ? DELIVERY_CONSOLE_MESSAGES.businessHoursInvalid
      : businessTimeToMinutes(draft.openTime) >= businessTimeToMinutes(draft.closeTime)
        ? DELIVERY_CONSOLE_MESSAGES.businessHoursOrderInvalid
        : undefined

  return {
    openTime: businessHoursError,
    closeTime: businessHoursError,
    avgPrepMinutes:
      Number.isInteger(avgPrepMinutes) &&
      avgPrepMinutes >= MIN_PREP_MINUTES &&
      avgPrepMinutes <= MAX_PREP_MINUTES
        ? undefined
        : DELIVERY_CONSOLE_MESSAGES.prepMinutesInvalid,
  }
}

type MerchantConsoleStateArgs = Pick<
  MerchantRoleProps,
  'merchantStores' | 'selectedMerchantStoreId' | 'runAction'
>

export type MenuComposerOpenState = Record<string, boolean>
export type MerchantAppealDraftMap = Record<string, string>
export type PartialRefundResolutionDraftMap = Record<string, string>
export type OrderRejectDraftMap = Record<string, string>
export type OrderChatDraftMap = Record<string, string>

export function useMerchantConsoleState({
  merchantStores,
  selectedMerchantStoreId,
  runAction,
}: MerchantConsoleStateArgs) {
  const activeMerchantStore = merchantStores.find((store) => store.id === selectedMerchantStoreId)
  const storesToRender = activeMerchantStore ? [activeMerchantStore] : merchantStores
  const [menuItemStockDrafts, setMenuItemStockDrafts] = useState<Record<string, string>>({})
  const [menuItemPriceDrafts, setMenuItemPriceDrafts] = useState<Record<string, string>>({})
  const [orderRejectDrafts, setOrderRejectDrafts] = useState<Record<string, string>>({})
  const [orderRejectErrors, setOrderRejectErrors] = useState<Record<string, string>>({})
  const [storeOperationDrafts, setStoreOperationDrafts] = useState<Record<string, StoreOperationDraft>>({})
  const [storeOperationErrors, setStoreOperationErrors] = useState<Record<string, StoreOperationErrors>>({})

  function getMenuItemStockDraft(item: MenuItem) {
    return menuItemStockDrafts[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getMenuItemPriceDraft(item: MenuItem) {
    return menuItemPriceDrafts[item.id] ?? (item.priceCents / CURRENCY_CENTS_SCALE).toFixed(2)
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

  function getMenuItemStockError(value: string) {
    const trimmed = value.trim()
    if (trimmed === '') return null
    const parsed = Number(trimmed)
    if (
      !Number.isInteger(parsed) ||
      parsed < MIN_MENU_ITEM_STOCK ||
      parsed > MAX_MENU_ITEM_STOCK
    ) {
      return DELIVERY_CONSOLE_MESSAGES.stockQuantityInvalid
    }
    return null
  }

  function getMenuItemPriceError(value: string) {
    const trimmed = value.trim()
    const parsed = Number(trimmed)
    const priceCents = Number.isFinite(parsed) ? Math.round(parsed * CURRENCY_CENTS_SCALE) : 0
    if (!Number.isFinite(parsed) || priceCents <= 0 || priceCents > MAX_MENU_ITEM_PRICE_CENTS) {
      return DELIVERY_CONSOLE_MESSAGES.menuItemPriceUpdateInvalid
    }
    return null
  }

  async function submitMenuItemStock(storeId: string, item: MenuItem) {
    const draft = getMenuItemStockDraft(item)
    if (getMenuItemStockError(draft)) return
    const trimmed = draft.trim()
    const success = await runAction(() =>
      updateStoreMenuItemStock(storeId, item.id, {
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
    const success = await runAction(() => updateStoreMenuItemPrice(storeId, item.id, { priceCents }))
    if (!success) return
    setMenuItemPriceDrafts((current) => ({
      ...current,
      [item.id]: (priceCents / CURRENCY_CENTS_SCALE).toFixed(2),
    }))
  }

  async function submitOrderReject(orderId: string) {
    const reason = normalizeWhitespace(getOrderRejectDraft(orderId))
      .trim()
      .slice(0, MAX_REJECT_ORDER_REASON_LENGTH)
    if (!reason) {
      setOrderRejectErrors((current) => ({
        ...current,
        [orderId]: DELIVERY_CONSOLE_MESSAGES.orderRejectReasonRequired,
      }))
      return
    }
    setOrderRejectErrors((current) => {
      const next = { ...current }
      delete next[orderId]
      return next
    })
    const success = await runAction(() => rejectOrder(orderId, { reason }))
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
      updateStoreOperationalInfo(store.id, {
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
      updateStoreMenuItemStock(storeId, item.id, { remainingQuantity: undefined }),
    )
    if (!success) return
    setMenuItemStockDrafts((current) => ({ ...current, [item.id]: '' }))
  }

  return {
    activeMerchantStore,
    storesToRender,
    getMenuItemStockDraft,
    getMenuItemPriceDraft,
    getOrderRejectDraft,
    getOrderRejectError,
    getStoreOperationDraft,
    getMenuItemStockError,
    getMenuItemPriceError,
    submitMenuItemStock,
    submitMenuItemPrice,
    submitOrderReject,
    submitStoreOperationalInfo,
    clearMenuItemStockLimit,
    setMenuItemStockDrafts,
    setMenuItemPriceDrafts,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    setStoreOperationDrafts,
    setStoreOperationErrors,
    storeOperationErrors,
  }
}

export type MerchantConsoleState = ReturnType<typeof useMerchantConsoleState>
export type MerchantConsolePanelProps = MerchantRoleProps & MerchantConsoleState
