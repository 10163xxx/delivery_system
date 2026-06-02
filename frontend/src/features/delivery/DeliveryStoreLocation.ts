import type { Store, StoreId } from '@/objects/core/SharedObjects'

export const STORE_LOCATION_STATUS = {
  locating: 'locating',
  located: 'located',
  unlocated: 'unlocated',
} as const

export type StoreLocationStatus =
  (typeof STORE_LOCATION_STATUS)[keyof typeof STORE_LOCATION_STATUS]

function getStoreLocationQuery(store: Store) {
  return store.storeAddress.trim() || store.name.trim()
}

export function isStoreLocated(status: StoreLocationStatus | undefined) {
  return status === STORE_LOCATION_STATUS.located
}

export function getStoreLocationStatus(store: Store | undefined) {
  if (!store) return STORE_LOCATION_STATUS.unlocated
  if (!getStoreLocationQuery(store)) return STORE_LOCATION_STATUS.unlocated
  return store.location ? STORE_LOCATION_STATUS.located : STORE_LOCATION_STATUS.unlocated
}

export function useStoreLocationStatus(store: Store | undefined) {
  return getStoreLocationStatus(store)
}

export function useStoreLocationStatusMap(stores: Store[]) {
  return stores.reduce<Record<StoreId, StoreLocationStatus>>((current, store) => ({
    ...current,
    [store.id]: getStoreLocationStatus(store),
  }), {})
}
