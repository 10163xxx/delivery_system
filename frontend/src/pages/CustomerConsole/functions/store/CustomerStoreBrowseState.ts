import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import {
  CUSTOMER_STORE_RESULT_COPY,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import {
  isStoreLocated,
  type StoreLocationStatus,
} from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'

export function getStoreBrowseHint(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  locationStatus: StoreLocationStatus,
) {
  if (!isStoreLocated(locationStatus)) return CUSTOMER_STORE_RESULT_COPY.locationUnavailableHint
  if (store.status === STORE_STATUS.revoked) return CUSTOMER_STORE_RESULT_COPY.unavailableStoreHint
  if (!isStoreCurrentlyOpen(store)) return CUSTOMER_STORE_RESULT_COPY.closedStoreHint
  if (store.menu.length === ZERO_COUNT) return CUSTOMER_STORE_RESULT_COPY.emptyMenuHint
  return CUSTOMER_STORE_RESULT_COPY.availableStoreHint
}

export function getStoreBrowseButtonLabel(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  if (!isStoreLocated(locationStatus)) return CUSTOMER_STORE_RESULT_COPY.locationUnavailableButton
  if (store.status === STORE_STATUS.revoked) return CUSTOMER_STORE_RESULT_COPY.unavailableStoreButton
  if (!isStoreCurrentlyOpen(store)) return CUSTOMER_STORE_RESULT_COPY.closedStoreButton
  if (store.menu.length === ZERO_COUNT) return CUSTOMER_STORE_RESULT_COPY.emptyMenuButton
  if (!isDeliverable) return CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreButton
  return CUSTOMER_STORE_RESULT_COPY.enterStoreButton
}

export function isStoreBrowseDisabled(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  return (
    !isStoreLocated(locationStatus) ||
    store.status === STORE_STATUS.revoked ||
    !isStoreCurrentlyOpen(store) ||
    store.menu.length === ZERO_COUNT ||
    !isDeliverable
  )
}

export function getResolvedStoreBrowseHint(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  if (isStoreLocated(locationStatus) && !isDeliverable) {
    return CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreHint
  }
  return getStoreBrowseHint(store, isStoreCurrentlyOpen, locationStatus)
}
