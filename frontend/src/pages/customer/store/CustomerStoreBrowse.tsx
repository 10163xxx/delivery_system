import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { CustomerStoreTab } from '@/pages/customer/object/CustomerPageObjects'
import {
  CustomerStatusBar,
  SearchHistoryPanel,
  StoreBrowseEmptyState,
  StoreCategoryGrid,
  StoreResultsGrid,
  StoreSearchBar,
} from '@/pages/customer/store/CustomerStoreCatalogSections'
import { SelectedStoreBanner } from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { Dispatch, SetStateAction } from 'react'

export function CustomerStoreBrowse(
  props: CustomerRoleProps & {
    selectedStoreTab: CustomerStoreTab
    setSelectedStoreTab: Dispatch<SetStateAction<CustomerStoreTab>>
  },
) {
  const { selectedStore, selectedStoreCategory, customerStoreSearch, categoryStores, visibleStores } =
    props
  const hasStoreSearch = customerStoreSearch.trim().length > 0
  const storesToBrowse = selectedStoreCategory ? categoryStores : visibleStores

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

      {!selectedStoreCategory && !hasStoreSearch && props.storeCategories.length > 0 ? (
        <StoreCategoryGrid props={props} />
      ) : storesToBrowse.length > 0 ? (
        <StoreResultsGrid props={props} storesToBrowse={storesToBrowse} />
      ) : (
        <StoreBrowseEmptyState props={props} />
      )}
    </>
  )
}
