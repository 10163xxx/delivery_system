import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'
import { persistCustomerStoreSearchHistory } from '@/customer/app/actions/CustomerActionHelpers'

type CustomerSearchParams = Pick<
  CustomerActionParams,
  | 'customerStoreSearchDraft'
  | 'setCustomerStoreSearchDraft'
  | 'setCustomerStoreSearch'
  | 'setCustomerStoreSearchHistory'
>

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
    window.localStorage.removeItem('customer-store-search-history')
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
