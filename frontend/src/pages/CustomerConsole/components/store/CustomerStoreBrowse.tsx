// Customer store browse orchestrator: search, category browsing, location filtering, and selected-store view.
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerStoreTab } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import {
  RecentFrequentStoresPanel,
  SearchHistoryPanel,
  StoreBrowseEmptyState,
  StoreCategoryGrid,
  StoreResultsGrid,
  StoreSearchBar,
} from '@/pages/CustomerConsole/components/store/CustomerStoreCatalogSections'
import { CustomerStatusBar } from '@/pages/CustomerConsole/components/store/CustomerHomeStatusBar'
import { SelectedStoreBanner } from '@/pages/CustomerConsole/components/store/CustomerSelectedStorePanel'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { CUSTOMER_STORE_VISIBILITY } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import {
  isStoreLocated,
  useStoreLocationStatusMap,
} from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'
import {
  CUSTOMER_STORE_SORT_MODE,
  ZERO_COUNT,
  type CustomerStoreSortMode,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

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
