import {
  CUSTOMER_PROFILE_NOTICE_SEEN_KEY_PREFIX,
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
} from '@/shared/delivery/DeliveryServices'

const SESSION_TOKEN_STORAGE_KEY = 'delivery-session-token'

function readJsonStorageValue(key: string): unknown {
  const stored = window.localStorage.getItem(key)
  if (!stored) return null
  return JSON.parse(stored)
}

function readStringArrayStorageValue(key: string, maxSize?: number) {
  const parsed = readJsonStorageValue(key)
  if (!Array.isArray(parsed)) return []

  const values = parsed.filter((entry): entry is string => typeof entry === 'string')
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

export const browserStorage = {
  readSessionToken() {
    return window.localStorage.getItem(SESSION_TOKEN_STORAGE_KEY)
  },
  saveSessionToken(token: string) {
    window.localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, token)
  },
  clearSessionToken() {
    window.localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY)
  },
  readCustomerStoreSearchHistory() {
    return readStringArrayStorageValue(
      CUSTOMER_STORE_SEARCH_HISTORY_KEY,
      MAX_CUSTOMER_STORE_SEARCH_HISTORY,
    )
  },
  saveCustomerStoreSearchHistory(values: string[]) {
    writeStringArrayStorageValue(CUSTOMER_STORE_SEARCH_HISTORY_KEY, values)
  },
  clearCustomerStoreSearchHistory() {
    window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
  },
  readSeenCustomerProfileNoticeIds(userId: string) {
    return readStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId))
  },
  saveSeenCustomerProfileNoticeIds(userId: string, noticeIds: string[]) {
    writeStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId), noticeIds)
  },
  clearSeenCustomerProfileNoticeIds(userId: string) {
    window.localStorage.removeItem(getCustomerProfileNoticeSeenStorageKey(userId))
  },
}
