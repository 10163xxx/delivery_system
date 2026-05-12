import type { DeliveryAppState } from '@/shared/object/core/SharedObjects'
import type { DeliveryPageViewDerivedArgs } from '@/shared/object/core/DeliveryPageObjects'
import {
  getActiveCustomerId,
  getDerivedCollections,
  getMerchantStores,
  getRiderOrders,
  getSelectedEntities,
} from '@/shared/app/delivery/DeliveryCollectionViewData'

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
  })
  const { selectedStore, selectedCustomer, merchantProfile, selectedRider } = selectedEntities
  const merchantStores = getMerchantStores(state, session)
  const riderOrders = getRiderOrders(state, session, selectedRiderId)
  const collections = getDerivedCollections(
    state,
    session,
    activeCustomerId,
    routeOrderId,
    customerStoreSearch,
    selectedStoreCategory,
    selectedStore,
    merchantStores,
  )

  return {
    state: state as DeliveryAppState | null,
    activeCustomerId,
    selectedStore,
    selectedCustomer,
    merchantStores,
    merchantProfile,
    selectedRider,
    riderOrders,
    ...collections,
    selectedMerchantStoreId,
    merchantWorkspaceView,
  }
}
