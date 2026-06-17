// Category tiles, sorted store results, and empty states for customer store browsing.
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { DisplayText, Store } from '@/objects/core/SharedObjects'
import type { StoreLocationStatus } from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'
import { CustomerStoreResultCard } from '@/pages/CustomerConsole/components/store/CustomerStoreResultCard'
export { StoreCategoryGrid } from '@/pages/CustomerConsole/components/store/StoreCategoryGrid'
import { CUSTOMER_STORE_VISIBILITY } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import {
  CUSTOMER_STORE_RESULT_REVIEW_PREVIEW_COUNT,
  CUSTOMER_STORE_SORT_MODE,
  EMPTY_TEXT,
  ZERO_COUNT,
  type CustomerStoreSortMode,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import {
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
  DELIVERY_UI,
  searchResultKeyword,
  searchResultSummary,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { CUSTOMER_FAVORITE_STORE_CATEGORY } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

function sortStoresForCustomerBrowse({
  referenceLocation,
  storeSortMode,
  storesToBrowse,
}: {
  referenceLocation: NonNullable<CustomerRoleProps['selectedCustomer']>['location'] | undefined
  storeSortMode: CustomerStoreSortMode
  storesToBrowse: Store[]
}) {
  return storesToBrowse.slice().sort((left: Store, right: Store) => {
    const distanceComparison =
      getStoreDeliveryQuote(left, referenceLocation).distanceKm -
      getStoreDeliveryQuote(right, referenceLocation).distanceKm
    const ratingComparison =
      right.averageRating - left.averageRating || right.ratingCount - left.ratingCount

    return storeSortMode === CUSTOMER_STORE_SORT_MODE.rating
      ? ratingComparison || distanceComparison
      : distanceComparison || ratingComparison
  })
}

function StoreResultsToolbar({
  props,
  sortedStoreCount,
  sortSummary,
}: {
  props: Pick<
    CustomerRoleProps,
    | 'customerStoreSearch'
    | 'resetStoreCategory'
    | 'selectedStoreCategory'
    | 'setCustomerStoreSearch'
  >
  sortedStoreCount: number
  sortSummary: string
}) {
  const {
    selectedStoreCategory,
    customerStoreSearch,
    setCustomerStoreSearch,
    resetStoreCategory,
  } = props

  return (
    <div className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryToolbarClassName}>
      <div>
        <p className={DELIVERY_UI.ticketKindClassName}>
          {selectedStoreCategory
            ? CUSTOMER_STORE_BROWSE_COPY.currentCategoryLabel
            : CUSTOMER_STORE_BROWSE_COPY.searchResultLabel}
        </p>
        <strong>
          {selectedStoreCategory || searchResultKeyword(customerStoreSearch.trim())}
        </strong>
        <p className={DELIVERY_UI.metaLineClassName}>
          {`${searchResultSummary(sortedStoreCount)} · ${sortSummary}`}
        </p>
      </div>
      <button
        className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryBackButtonClassName}
        onClick={() => {
          if (selectedStoreCategory) {
            resetStoreCategory()
          } else {
            setCustomerStoreSearch(asDomainText<DisplayText>(EMPTY_TEXT))
          }
        }}
        style={{
          minWidth: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonMinWidth,
          minHeight: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonMinHeight,
          fontSize: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonFontSize,
        }}
        type={DELIVERY_UI.buttonType}
      >
        {selectedStoreCategory
          ? CUSTOMER_STORE_BROWSE_COPY.backToAllCategoriesButton
          : CUSTOMER_STORE_BROWSE_COPY.clearSearchResultButton}
      </button>
    </div>
  )
}

function StoreResultCardGrid({
  props,
  sortedStores,
  storeLocationStatusMap,
}: {
  props: CustomerRoleProps
  sortedStores: Store[]
  storeLocationStatusMap?: Record<string, StoreLocationStatus>
}) {
  const {
    enterStore,
    favoriteStoreIds,
    formatAggregateRating,
    formatPrice,
    formatStoreAvailability,
    formatTime,
    isStoreCurrentlyOpen,
    monthlyOrdersByStore,
    selectedCustomer,
    storeBrowseHighlights,
    storeCustomerReviews,
    toggleBlockedStore,
    toggleFavoriteStore,
  } = props

  return (
    <div className={CUSTOMER_STORE_BROWSE_LAYOUT.compactStoreGridClassName}>
      {sortedStores.map((store: Store) => {
        const reviews = storeCustomerReviews[store.id] ?? []
        return (
          <CustomerStoreResultCard
            key={store.id}
            props={{
              enterStore,
              favoriteStoreIds,
              formatAggregateRating,
              formatPrice,
              formatStoreAvailability,
              formatTime,
              isStoreCurrentlyOpen,
              monthlyOrdersByStore,
              selectedCustomer,
              storeLocationStatus: storeLocationStatusMap?.[store.id],
              storeBrowseHighlights,
              toggleBlockedStore,
              toggleFavoriteStore,
            }}
            reviews={reviews.slice(ZERO_COUNT, CUSTOMER_STORE_RESULT_REVIEW_PREVIEW_COUNT)}
            store={store}
          />
        )
      })}
    </div>
  )
}

export function StoreResultsGrid({
  props,
  storeLocationStatusMap,
  storeSortMode,
  storesToBrowse,
}: {
  props: CustomerRoleProps
  storeLocationStatusMap?: Record<string, StoreLocationStatus>
  storeSortMode: CustomerStoreSortMode
  storesToBrowse: Store[]
}) {
  const sortedStores = sortStoresForCustomerBrowse({
    referenceLocation: props.selectedCustomer?.location,
    storeSortMode,
    storesToBrowse,
  })
  const sortSummary =
    storeSortMode === CUSTOMER_STORE_SORT_MODE.rating
      ? CUSTOMER_STORE_BROWSE_COPY.sortedByRatingSummary
      : CUSTOMER_STORE_BROWSE_COPY.sortedByDistanceSummary

  return (
    <>
      <StoreResultsToolbar props={props} sortedStoreCount={sortedStores.length} sortSummary={sortSummary} />
      <StoreResultCardGrid
        props={props}
        sortedStores={sortedStores}
        storeLocationStatusMap={storeLocationStatusMap}
      />
    </>
  )
}

export function StoreBrowseEmptyState({ props }: { props: CustomerRoleProps }) {
  const { customerStoreSearch, customerStoreVisibility, resetStoreCategory } = props
  const showOrderableOnly =
    customerStoreVisibility === CUSTOMER_STORE_VISIBILITY.orderableOnly

  return (
    <div className={DELIVERY_UI.emptyCardClassName}>
      {customerStoreSearch.trim()
        ? CUSTOMER_STORE_BROWSE_COPY.emptySearchResult
        : props.selectedStoreCategory === CUSTOMER_FAVORITE_STORE_CATEGORY
          ? CUSTOMER_STORE_BROWSE_COPY.emptyFavoriteCategoryResult
        : showOrderableOnly
          ? CUSTOMER_STORE_BROWSE_COPY.switchToAllStoresHint
          : CUSTOMER_STORE_BROWSE_COPY.emptyCategoryResult}
      <button className={DELIVERY_UI.secondaryButtonClassName} onClick={() => resetStoreCategory()} type={DELIVERY_UI.buttonType}>
        {CUSTOMER_STORE_BROWSE_COPY.backToCategoryListButton}
      </button>
    </div>
  )
}
