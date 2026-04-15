import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'

export function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record }
  delete next[key]
  return next
}

export function persistCustomerStoreSearchHistory(next: string[]) {
  if (next.length === 0) {
    window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
    return
  }

  window.localStorage.setItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY, JSON.stringify(next))
}

export function clearDraftError(
  setter:
    | CustomerActionParams['setPartialRefundErrors']
    | CustomerActionParams['setAfterSalesErrors']
    | CustomerActionParams['setReviewErrors'],
  key: string,
) {
  setter((current) => removeKey(current, key))
}

export function setDraftError(
  setter:
    | CustomerActionParams['setPartialRefundErrors']
    | CustomerActionParams['setAfterSalesErrors']
    | CustomerActionParams['setReviewErrors']
    | CustomerActionParams['setOrderChatErrors'],
  key: string,
  message: string,
) {
  setter((current) => ({ ...current, [key]: message }))
}
