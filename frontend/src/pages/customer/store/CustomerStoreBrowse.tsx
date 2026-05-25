import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { CustomerStoreTab } from '@/pages/customer/object/CustomerPageObjects'
import {
  CustomerStatusBar,
  RecentFrequentStoresPanel,
  SearchHistoryPanel,
  StoreBrowseEmptyState,
  StoreCategoryGrid,
  StoreResultsGrid,
  StoreSearchBar,
} from '@/pages/customer/store/CustomerStoreCatalogSections'
import { SelectedStoreBanner } from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { Dispatch, SetStateAction } from 'react'
import { CUSTOMER_STORE_VISIBILITY } from '@/shared/object/core/DeliveryAppObjects'

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
    visibleStores,
  } =
    props
  const hasStoreSearch = customerStoreSearch.trim().length > 0
  const showOrderableOnly = customerStoreVisibility === CUSTOMER_STORE_VISIBILITY.orderableOnly
  const filteredVisibleStores = showOrderableOnly
    ? visibleStores.filter((store) => isStoreCurrentlyOpen(store) && store.menu.length > 0)
    : visibleStores
  const filteredCategoryStores = showOrderableOnly
    ? categoryStores.filter((store) => isStoreCurrentlyOpen(store) && store.menu.length > 0)
    : categoryStores
  const filteredRecentFrequentStores = showOrderableOnly
    ? recentFrequentStores.filter((entry) => entry.canOrder)
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
      <StoreSearchBar props={props} />
      <SearchHistoryPanel props={props} />
      <CustomerStatusBar props={props} />
      {!selectedStoreCategory && !hasStoreSearch ? (
        <RecentFrequentStoresPanel
          props={{ ...props, recentFrequentStores: filteredRecentFrequentStores }}
        />
      ) : null}

      {!selectedStoreCategory && !hasStoreSearch && props.storeCategories.length > 0 ? (
        <StoreCategoryGrid props={{ ...props, visibleStores: filteredVisibleStores }} />
      ) : storesToBrowse.length > 0 ? (
        <StoreResultsGrid props={props} storesToBrowse={storesToBrowse} />
      ) : (
        <StoreBrowseEmptyState props={props} />
      )}
    </>
  )
}
