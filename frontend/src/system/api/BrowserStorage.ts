import { CUSTOMER_BLOCKED_STORE_IDS_KEY_PREFIX, CUSTOMER_FAVORITE_STORE_IDS_KEY_PREFIX, CUSTOMER_PROFILE_NOTICE_SEEN_KEY_PREFIX, CUSTOMER_STORE_SEARCH_HISTORY_KEY, MAX_CUSTOMER_STORE_SEARCH_HISTORY } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

const memoryStorage = new Map<string, string[]>()
let memorySessionToken: string | null = null

function readStringArrayStorageValue(key: string, maxSize?: number) {
  const values = memoryStorage.get(key) ?? []
  return typeof maxSize === 'number' ? values.slice(0, maxSize) : values
}

function writeStringArrayStorageValue(key: string, values: string[]) {
  if (values.length === 0) {
    memoryStorage.delete(key)
    return
  }

  memoryStorage.set(key, values)
}

export function getCustomerProfileNoticeSeenStorageKey(userId: string) {
  return `${CUSTOMER_PROFILE_NOTICE_SEEN_KEY_PREFIX}:${userId}`
}

export function getCustomerFavoriteStoreIdsStorageKey(userId: string) {
  return `${CUSTOMER_FAVORITE_STORE_IDS_KEY_PREFIX}:${userId}`
}

export function getCustomerBlockedStoreIdsStorageKey(userId: string) {
  return `${CUSTOMER_BLOCKED_STORE_IDS_KEY_PREFIX}:${userId}`
}

export function readSessionToken() {
  return memorySessionToken
}

export function saveSessionToken(token: string) {
  memorySessionToken = token
}

export function clearSessionToken() {
  memorySessionToken = null
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
  memoryStorage.delete(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
}

export function readCustomerFavoriteStoreIds(userId: string) {
  return readStringArrayStorageValue(getCustomerFavoriteStoreIdsStorageKey(userId))
}

export function saveCustomerFavoriteStoreIds(userId: string, values: string[]) {
  writeStringArrayStorageValue(getCustomerFavoriteStoreIdsStorageKey(userId), values)
}

export function clearCustomerFavoriteStoreIds(userId: string) {
  memoryStorage.delete(getCustomerFavoriteStoreIdsStorageKey(userId))
}

export function readCustomerBlockedStoreIds(userId: string) {
  return readStringArrayStorageValue(getCustomerBlockedStoreIdsStorageKey(userId))
}

export function saveCustomerBlockedStoreIds(userId: string, values: string[]) {
  writeStringArrayStorageValue(getCustomerBlockedStoreIdsStorageKey(userId), values)
}

export function clearCustomerBlockedStoreIds(userId: string) {
  memoryStorage.delete(getCustomerBlockedStoreIdsStorageKey(userId))
}

export function readSeenCustomerProfileNoticeIds(userId: string) {
  return readStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId))
}

export function saveSeenCustomerProfileNoticeIds(userId: string, noticeIds: string[]) {
  writeStringArrayStorageValue(getCustomerProfileNoticeSeenStorageKey(userId), noticeIds)
}

export function clearSeenCustomerProfileNoticeIds(userId: string) {
  memoryStorage.delete(getCustomerProfileNoticeSeenStorageKey(userId))
}
