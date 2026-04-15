import type { CustomerRoleProps } from '@/shared/AppBuildRoleProps'
import {
  CustomerStatusBar,
  SearchHistoryPanel,
  StoreBrowseEmptyState,
  StoreCategoryGrid,
  StoreResultsGrid,
  StoreSearchBar,
} from '@/customer/pages/CustomerStoreBrowseParts'
import { SelectedStoreBanner } from '@/customer/pages/CustomerSelectedStorePanel'

export function CustomerStoreBrowse(props: CustomerRoleProps) {
  const { selectedStore, selectedStoreCategory, customerStoreSearch, categoryStores, visibleStores } =
    props
  const hasStoreSearch = customerStoreSearch.trim().length > 0
  const storesToBrowse = selectedStoreCategory ? categoryStores : visibleStores

  if (selectedStore) {
    return <SelectedStoreBanner props={props} />
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
