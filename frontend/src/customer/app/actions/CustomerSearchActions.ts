import { browserStorage } from '@/shared/api/SharedApi'
import { persistCustomerStoreSearchHistory } from '@/customer/app/actions/CustomerActionHelpers'
import type { CustomerSearchParams } from '@/customer/object/action/CustomerActionObjects'

export function createCustomerSearchActions(params: CustomerSearchParams) {
  const {
    customerStoreSearchDraft,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreSearchHistory,
  } = params

  function submitCustomerStoreSearch(keyword?: string) {
    const nextKeyword = (keyword ?? customerStoreSearchDraft).trim()
    setCustomerStoreSearchDraft(nextKeyword)
    setCustomerStoreSearch(nextKeyword)
  }

  function clearCustomerStoreSearchHistory() {
    setCustomerStoreSearchHistory([])
    browserStorage.clearCustomerStoreSearchHistory()
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
