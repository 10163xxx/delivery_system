import { browserStorage } from '@/shared/api/SharedApi'
import type { CustomerActionParams } from '@/customer/object/action/CustomerActionTypes'

export function removeKey<T>(record: Record<string, T>, key: string) {
  const next = { ...record }
  delete next[key]
  return next
}

export function persistCustomerStoreSearchHistory(next: string[]) {
  if (next.length === 0) {
    browserStorage.clearCustomerStoreSearchHistory()
    return
  }

  browserStorage.saveCustomerStoreSearchHistory(next)
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
