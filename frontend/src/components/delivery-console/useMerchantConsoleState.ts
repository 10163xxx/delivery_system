import { useEffect, useState } from 'react'
import { rejectOrder, updateStoreMenuItemStock, updateStoreOperationalInfo } from '@/api'
import {
  DELIVERY_CONSOLE_MESSAGES,
  MAX_MENU_ITEM_STOCK,
  MAX_PREP_MINUTES,
  MAX_REJECT_ORDER_REASON_LENGTH,
  MIN_MENU_ITEM_STOCK,
  MIN_PREP_MINUTES,
  MINUTES_PER_HOUR,
} from '@/features/delivery-console'

export function useMerchantConsoleState({ merchantStores, selectedMerchantStoreId, runAction }: any) {
  const activeMerchantStore = merchantStores.find((store: any) => store.id === selectedMerchantStoreId)
  const storesToRender = activeMerchantStore ? [activeMerchantStore] : merchantStores
  const [menuItemStockDrafts, setMenuItemStockDrafts] = useState<Record<string, string>>({})
  const [orderRejectDrafts, setOrderRejectDrafts] = useState<Record<string, string>>({})
  const [orderRejectErrors, setOrderRejectErrors] = useState<Record<string, string>>({})
  const [storeOperationDrafts, setStoreOperationDrafts] = useState<Record<string, { openTime: string; closeTime: string; avgPrepMinutes: string }>>({})
  const [storeOperationErrors, setStoreOperationErrors] = useState<Record<string, { openTime?: string; closeTime?: string; avgPrepMinutes?: string }>>({})

  useEffect(() => {
    const validItemIds = new Set(storesToRender.flatMap((store: any) => store.menu.map((item: any) => item.id)))

    setMenuItemStockDrafts((current) => {
      const nextDrafts: Record<string, string> = {}
      storesToRender.forEach((store: any) => {
        store.menu.forEach((item: any) => {
          nextDrafts[item.id] = current[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
        })
      })
      Object.keys(nextDrafts).forEach((itemId) => {
        if (!validItemIds.has(itemId)) delete nextDrafts[itemId]
      })
      return nextDrafts
    })
  }, [storesToRender])

  useEffect(() => {
    setStoreOperationDrafts((current) => {
      const nextDrafts: Record<string, { openTime: string; closeTime: string; avgPrepMinutes: string }> = {}
      storesToRender.forEach((store: any) => {
        nextDrafts[store.id] = current[store.id] ?? {
          openTime: store.businessHours.openTime,
          closeTime: store.businessHours.closeTime,
          avgPrepMinutes: String(store.avgPrepMinutes),
        }
      })
      return nextDrafts
    })
  }, [storesToRender])

  function getMenuItemStockDraft(item: any) {
    return menuItemStockDrafts[item.id] ?? (item.remainingQuantity == null ? '' : String(item.remainingQuantity))
  }

  function getOrderRejectDraft(orderId: string) {
    return orderRejectDrafts[orderId] ?? ''
  }

  function getOrderRejectError(orderId: string) {
    return orderRejectErrors[orderId] ?? ''
  }

  function getStoreOperationDraft(store: any) {
    return storeOperationDrafts[store.id] ?? {
      openTime: store.businessHours.openTime,
      closeTime: store.businessHours.closeTime,
      avgPrepMinutes: String(store.avgPrepMinutes),
    }
  }

  function isValidBusinessTime(value: string) {
    return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
  }

  function businessTimeToMinutes(value: string) {
    if (!isValidBusinessTime(value)) return Number.NaN
    const [hours, minutes] = value.split(':').map(Number)
    return hours * MINUTES_PER_HOUR + minutes
  }

  function validateStoreOperationDraft(store: any) {
    const draft = getStoreOperationDraft(store)
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

  async function submitMenuItemStock(storeId: string, item: any) {
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

  async function submitOrderReject(orderId: string) {
    const reason = getOrderRejectDraft(orderId)
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, MAX_REJECT_ORDER_REASON_LENGTH)
    if (!reason) {
      setOrderRejectErrors((current) => ({ ...current, [orderId]: DELIVERY_CONSOLE_MESSAGES.orderRejectReasonRequired }))
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

  async function submitStoreOperationalInfo(store: any) {
    const draft = getStoreOperationDraft(store)
    const errors = validateStoreOperationDraft(store)
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

  async function clearMenuItemStockLimit(storeId: string, item: any) {
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
    getOrderRejectDraft,
    getOrderRejectError,
    getStoreOperationDraft,
    getMenuItemStockError,
    submitMenuItemStock,
    submitOrderReject,
    submitStoreOperationalInfo,
    clearMenuItemStockLimit,
    setMenuItemStockDrafts,
    setOrderRejectDrafts,
    setOrderRejectErrors,
    setStoreOperationDrafts,
    setStoreOperationErrors,
    storeOperationErrors,
  }
}
