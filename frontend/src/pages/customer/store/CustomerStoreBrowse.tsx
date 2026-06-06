// Customer store browse orchestrator: search, category browsing, location filtering, and selected-store view.
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { CustomerStoreTab } from '@/pages/customer/objects/CustomerPageObjects'
import {
  RecentFrequentStoresPanel,
  SearchHistoryPanel,
  StoreBrowseEmptyState,
  StoreCategoryGrid,
  StoreResultsGrid,
  StoreSearchBar,
} from '@/pages/customer/store/CustomerStoreCatalogSections'
import { CustomerStatusBar } from '@/pages/customer/store/CustomerHomeStatusBar'
import { SelectedStoreBanner } from '@/pages/customer/store/CustomerSelectedStorePanel'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { CUSTOMER_STORE_VISIBILITY } from '@/pages/delivery/objects/DeliveryAppObjects'
import { getStoreDeliveryQuote } from '@/features/delivery/DeliveryServices'
import {
  isStoreLocated,
  useStoreLocationStatusMap,
} from '@/features/delivery/DeliveryStoreLocation'
import {
  CUSTOMER_STORE_SORT_MODE,
  ZERO_COUNT,
  type CustomerStoreSortMode,
} from '@/features/delivery/DeliveryConstants'

export function CustomerStoreBrowse(
  props: CustomerRoleProps & {
    selectedStoreTab: CustomerStoreTab
    setSelectedStoreTab: Dispatch<SetStateAction<CustomerStoreTab>>
  },
) {
  const {
    selectedStore,
    selectedStoreCategory,
    customerStoreSearch,
    categoryStores,
    customerStoreVisibility,
    isStoreCurrentlyOpen,
    recentFrequentStores,
    selectedCustomer,
    visibleStores,
  } =
    props
  const [storeSortMode, setStoreSortMode] = useState<CustomerStoreSortMode>(
    CUSTOMER_STORE_SORT_MODE.distance,
  )
  const referenceLocation = selectedCustomer?.location
  const storeLocationStatusMap = useStoreLocationStatusMap(props.stores)
  const isStoreLocationReady = (store: typeof visibleStores[number]) =>
    isStoreLocated(storeLocationStatusMap[store.id])
  const hasStoreSearch = customerStoreSearch.trim().length > ZERO_COUNT
  const showOrderableOnly = customerStoreVisibility === CUSTOMER_STORE_VISIBILITY.orderableOnly
  // Orderable-only filtering requires both a known location and a currently deliverable store.
  const filteredVisibleStores = showOrderableOnly
    ? visibleStores.filter((store) =>
        isStoreLocationReady(store) &&
        isStoreCurrentlyOpen(store) &&
        store.menu.length > ZERO_COUNT &&
        getStoreDeliveryQuote(store, referenceLocation).isDeliverable,
      )
    : visibleStores
  const filteredCategoryStores = showOrderableOnly
    ? categoryStores.filter((store) =>
        isStoreLocationReady(store) &&
        isStoreCurrentlyOpen(store) &&
        store.menu.length > ZERO_COUNT &&
        getStoreDeliveryQuote(store, referenceLocation).isDeliverable,
      )
    : categoryStores
  const filteredRecentFrequentStores = showOrderableOnly
    ? recentFrequentStores.filter((entry) => entry.canOrder && isStoreLocated(storeLocationStatusMap[entry.storeId]))
    : recentFrequentStores
  const storesToBrowse = selectedStoreCategory ? filteredCategoryStores : filteredVisibleStores

  if (selectedStore) {
    return (
      <SelectedStoreBanner
        props={props}
        selectedStoreTab={props.selectedStoreTab}
        setSelectedStoreTab={props.setSelectedStoreTab}
      />
    )
  }

  return (
    <>
      <StoreSearchBar
        props={props}
        storeSortMode={storeSortMode}
        setStoreSortMode={setStoreSortMode}
      />
      <SearchHistoryPanel props={props} />
      <CustomerStatusBar props={props} />
      {!selectedStoreCategory && !hasStoreSearch ? (
        <RecentFrequentStoresPanel
          props={{ ...props, recentFrequentStores: filteredRecentFrequentStores }}
        />
      ) : null}

      {!selectedStoreCategory && !hasStoreSearch && props.storeCategories.length > ZERO_COUNT ? (
        <StoreCategoryGrid props={{ ...props, visibleStores: filteredVisibleStores }} />
      ) : storesToBrowse.length > ZERO_COUNT ? (
        <StoreResultsGrid
          props={props}
          storeLocationStatusMap={storeLocationStatusMap}
          storeSortMode={storeSortMode}
          storesToBrowse={storesToBrowse}
        />
      ) : (
        <StoreBrowseEmptyState props={props} />
      )}
    </>
  )
}
