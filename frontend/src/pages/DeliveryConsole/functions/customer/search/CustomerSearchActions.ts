import {
  clearCustomerStoreSearchHistory as clearStoredCustomerStoreSearchHistory,
  saveCustomerBlockedStoreIds,
  saveCustomerFavoriteStoreIds,
} from '@/system/api/SharedApi'
import { persistCustomerStoreSearchHistory } from '@/pages/DeliveryConsole/functions/customer/common/CustomerActionHelpers'
import type { CustomerSearchParams } from '@/pages/CustomerConsole/objects/CustomerActionObjects'
import type { DisplayText, StoreId } from '@/objects/core/SharedObjects'

export function createCustomerSearchActions(params: CustomerSearchParams) {
  const {
    activeCustomerId,
    customerStoreSearchDraft,
    favoriteStoreIds,
    blockedStoreIds,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreSearchHistory,
    setFavoriteStoreIds,
    setBlockedStoreIds,
  } = params

  function submitCustomerStoreSearch(keyword?: DisplayText) {
    const nextKeyword = (keyword ?? customerStoreSearchDraft).trim() as DisplayText
    setCustomerStoreSearchDraft(nextKeyword)
    setCustomerStoreSearch(nextKeyword)
  }

  function clearCustomerStoreSearchHistory() {
    setCustomerStoreSearchHistory([])
    clearStoredCustomerStoreSearchHistory()
  }

  function removeCustomerStoreSearchHistoryItem(keyword: string) {
    setCustomerStoreSearchHistory((current) => {
      const next = current.filter((entry) => entry !== keyword)
      persistCustomerStoreSearchHistory(next)
      return next
    })
  }

  function toggleFavoriteStore(storeId: StoreId) {
    if (!activeCustomerId) return

    setFavoriteStoreIds((current) => {
      const next = current.includes(storeId)
        ? current.filter((entry) => entry !== storeId)
        : [storeId, ...current.filter((entry) => entry !== storeId)]
      saveCustomerFavoriteStoreIds(activeCustomerId, next)
      return next
    })
  }

  function toggleBlockedStore(storeId: StoreId) {
    if (!activeCustomerId) return

    const willBlockStore = !blockedStoreIds.includes(storeId)
    setBlockedStoreIds((current) => {
      const next = current.includes(storeId)
        ? current.filter((entry) => entry !== storeId)
        : [storeId, ...current.filter((entry) => entry !== storeId)]
      saveCustomerBlockedStoreIds(activeCustomerId, next)
      return next
    })

    if (!willBlockStore || !favoriteStoreIds.includes(storeId)) return

    setFavoriteStoreIds((current) => {
      const next = current.filter((entry) => entry !== storeId)
      saveCustomerFavoriteStoreIds(activeCustomerId, next)
      return next
    })
  }

  return {
    submitCustomerStoreSearch,
    clearCustomerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    toggleFavoriteStore,
    toggleBlockedStore,
  }
}
