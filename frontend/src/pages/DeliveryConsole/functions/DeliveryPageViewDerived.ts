import type { DeliveryAppState } from '@/objects/core/SharedObjects'
import type { DeliveryPageViewDerivedArgs } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import {
  getActiveCustomerId,
  getDerivedCollections,
  getMerchantStores,
  getRiderOrders,
  getSelectedEntities,
} from '@/pages/DeliveryConsole/functions/viewData/DeliveryCollectionViewData'

export function getDeliveryConsolePageViewDerived(
  args: DeliveryPageViewDerivedArgs,
) {
  const {
    routeOrderId,
    sessionService,
    selectedCustomerId,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    selectedRiderId,
    customerStoreSearch,
    favoriteStoreIds,
    blockedStoreIds,
    merchantWorkspaceView,
  } = args
  const { session, state } = sessionService

  const activeCustomerId = getActiveCustomerId(session, selectedCustomerId)
  const selectedEntities = getSelectedEntities({
    state,
    session,
    activeCustomerId,
    selectedStoreId,
    selectedRiderId,
    blockedStoreIds,
  })
  const { selectedStore, selectedCustomer, merchantProfile, selectedRider } = selectedEntities
  const merchantStores = getMerchantStores(state, session)
  const riderOrderCollections = getRiderOrders(state, session, selectedRiderId)
  const collections = getDerivedCollections({
    state,
    session,
    activeCustomerId,
    routeOrderId,
    customerStoreSearch,
    selectedStoreCategory,
    favoriteStoreIds,
    blockedStoreIds,
    selectedStore,
    merchantStores,
  })

  return {
    state: state as DeliveryAppState | null,
    activeCustomerId,
    selectedStore,
    selectedCustomer,
    merchantStores,
    merchantProfile,
    selectedRider,
    ...riderOrderCollections,
    ...collections,
    favoriteStoreIds,
    blockedStoreIds,
    selectedMerchantStoreId,
    merchantWorkspaceView,
  }
}
