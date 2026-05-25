import type { Dispatch, SetStateAction } from 'react'
import {
  clearCustomerStoreSearchHistory,
  saveCustomerStoreSearchHistory,
} from '@/shared/api/SharedApi'

export function removeKey<K extends string, T>(record: Record<K, T>, key: K) {
  const next = { ...record }
  delete next[key]
  return next
}

export function persistCustomerStoreSearchHistory(next: string[]) {
  if (next.length === 0) {
    clearCustomerStoreSearchHistory()
    return
  }

  saveCustomerStoreSearchHistory(next)
}

export function clearDraftError<K extends string, V extends string>(
  setter: Dispatch<SetStateAction<Record<K, V>>>,
  key: K,
) {
  setter((current) => removeKey(current, key))
}

export function setDraftError<K extends string, V extends string>(
  setter: Dispatch<SetStateAction<Record<K, V>>>,
  key: K,
  message: string,
) {
  setter((current) => ({ ...current, [key]: message as V }))
}
