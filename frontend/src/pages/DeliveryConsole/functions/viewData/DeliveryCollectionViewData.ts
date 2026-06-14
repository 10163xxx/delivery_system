import type {
  CustomerId,
  OrderId,
  Store,
  StoreId,
} from '@/objects/core/SharedObjects'
import { CUSTOMER_FAVORITE_STORE_CATEGORY, STORE_CATEGORIES } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import type {
  DeliveryPageDerivedState,
  SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import { getAnalyticsCollections } from '@/pages/DeliveryConsole/functions/viewData/DeliveryAnalyticsViewData'
import {
  getCustomerNoticeCollections,
  getCustomerOrderCollections,
  getCustomerStoreCollections,
} from '@/pages/DeliveryConsole/functions/viewData/DeliveryCustomerCollectionViewData'
import { getMerchantApplicationCollections } from '@/pages/DeliveryConsole/functions/viewData/DeliveryMerchantCollectionViewData'
import { getReviewAndTicketCollections } from '@/pages/DeliveryConsole/functions/viewData/DeliveryReviewTicketCollectionViewData'

export {
  getActiveCustomerId,
  getSelectedEntities,
} from '@/pages/DeliveryConsole/functions/viewData/DeliverySelectedEntityViewData'
export {
  getCustomerNoticeCollections,
  getCustomerOrderCollections,
  getCustomerStoreCollections,
} from '@/pages/DeliveryConsole/functions/viewData/DeliveryCustomerCollectionViewData'
export {
  getMerchantApplicationCollections,
  getMerchantStores,
} from '@/pages/DeliveryConsole/functions/viewData/DeliveryMerchantCollectionViewData'
export { getRiderOrders } from '@/pages/DeliveryConsole/functions/viewData/DeliveryRiderCollectionViewData'
export { getReviewAndTicketCollections } from '@/pages/DeliveryConsole/functions/viewData/DeliveryReviewTicketCollectionViewData'

export type DerivedCollectionsParams = {
  state: DeliveryPageDerivedState
  session: SessionState['session']
  activeCustomerId: CustomerId | ''
  routeOrderId: OrderId | undefined
  customerStoreSearch: string
  selectedStoreCategory: string
  favoriteStoreIds: StoreId[]
  blockedStoreIds: StoreId[]
  selectedStore: Store | undefined
  merchantStores: Store[]
}

export function getDerivedCollections(params: DerivedCollectionsParams) {
  const {
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
  } = params
  const customerOrders = getCustomerOrderCollections(state, activeCustomerId, routeOrderId)
  return {
    ...customerOrders,
    ...getMerchantApplicationCollections(state, session),
    ...getReviewAndTicketCollections(state),
    ...getCustomerNoticeCollections(
      state?.customers.find((customer) => customer.id === activeCustomerId),
      customerOrders.customerOrders,
      customerOrders.completedCustomerOrders,
      state?.tickets ?? [],
    ),
    ...getCustomerStoreCollections(
      state,
      state?.customers.find((customer) => customer.id === activeCustomerId),
      customerStoreSearch,
      selectedStoreCategory,
      favoriteStoreIds,
      blockedStoreIds,
    ),
    ...getAnalyticsCollections(state, merchantStores, selectedStore, customerOrders.customerOrders),
    storeCategories: [...STORE_CATEGORIES, CUSTOMER_FAVORITE_STORE_CATEGORY],
  }
}
