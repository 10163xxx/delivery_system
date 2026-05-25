import { clearCustomerStoreSearchHistory as clearStoredCustomerStoreSearchHistory } from '@/shared/api/SharedApi'
import { persistCustomerStoreSearchHistory } from '@/customer/app/actions/CustomerActionHelpers'
import type { CustomerSearchParams } from '@/pages/customer/object/CustomerActionObjects'
import type { DisplayText } from '@/shared/object/core/SharedObjects'

export function createCustomerSearchActions(params: CustomerSearchParams) {
  const {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreSearchHistory,
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

  return {
    submitCustomerStoreSearch,
    clearCustomerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
  }
}
