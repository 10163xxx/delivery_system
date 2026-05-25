import {
  CUSTOMER_PROFILE_NOTICE_SEEN_KEY_PREFIX,
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
} from '@/shared/delivery/DeliveryServices'
import { decodeStringArray } from '@/shared/api/ResponseDecoders'

const SESSION_TOKEN_STORAGE_KEY = 'delivery-session-token'

function readJsonStorageValue(key: string): unknown {
  const stored = window.localStorage.getItem(key)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

function readStringArrayStorageValue(key: string, maxSize?: number) {
  const parsed = readJsonStorageValue(key)
  let values: string[]

  try {
    values = decodeStringArray(parsed)
  } catch {
    return []
  }

  return typeof maxSize === 'number' ? values.slice(0, maxSize) : values
}

function writeStringArrayStorageValue(key: string, values: string[]) {
  if (values.length === 0) {
    window.localStorage.removeItem(key)
    return
  }

  window.localStorage.setItem(key, JSON.stringify(values))
}

export function getCustomerProfileNoticeSeenStorageKey(userId: string) {
  return `${CUSTOMER_PROFILE_NOTICE_SEEN_KEY_PREFIX}:${userId}`
}

export function readSessionToken() {
  return window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
}

export function saveSessionToken(token: string) {
  window.localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token)
}

export function clearSessionToken() {
  window.localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY)
}

export function readCustomerStoreSearchHistory() {
  return readStringArrayStorageValue(
    CUSTOMER_STORE_SEARCH_HISTORY_KEY,
    MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  )
}

export function saveCustomerStoreSearchHistory(values: string[]) {
  writeStringArrayStorageValue(CUSTOMER_STORE_SEARCH_HISTORY_KEY, values)
}

export function clearCustomerStoreSearchHistory() {
  window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
}

export function readSeenCustomerProfileNoticeIds(userId: string) {
  return readStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId))
}

export function saveSeenCustomerProfileNoticeIds(userId: string, noticeIds: string[]) {
  writeStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId), noticeIds)
}

export function clearSeenCustomerProfileNoticeIds(userId: string) {
  window.localStorage.removeItem(getCustomerProfileNoticeSeenStorageKey(userId))
}
