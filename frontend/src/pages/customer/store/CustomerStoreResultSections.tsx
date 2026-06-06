// Category tiles, sorted store results, and empty states for customer store browsing.
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { DisplayText, Store } from '@/objects/core/SharedObjects'
import type { StoreLocationStatus } from '@/features/delivery/DeliveryStoreLocation'
import { CustomerStoreResultCard } from '@/pages/customer/store/CustomerStoreResultCard'
import { CUSTOMER_STORE_VISIBILITY } from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  CUSTOMER_STORE_RESULT_REVIEW_PREVIEW_COUNT,
  CUSTOMER_STORE_SORT_MODE,
  CUSTOMER_FAVORITE_CATEGORY_IMAGE_SRC,
  EMPTY_TEXT,
  ZERO_COUNT,
  type CustomerStoreSortMode,
} from '@/features/delivery/DeliveryConstants'
import {
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
  DELIVERY_UI,
  SELECTED_STORE_SECTIONS_LAYOUT,
  categoryImageAlt,
  categoryOrderableCoverageSummary,
  searchResultKeyword,
  searchResultSummary,
} from '@/features/delivery/DeliveryMessages'
import {
  CUSTOMER_FAVORITE_STORE_CATEGORY,
  getStoreDeliveryQuote,
} from '@/features/delivery/DeliveryServices'
import { asDomainText } from '@/features/delivery/DeliveryShared'

export function StoreCategoryGrid({ props }: { props: CustomerRoleProps }) {
  const {
    storeCategories,
    visibleStores,
    getCategoryMeta,
    chooseStoreCategory,
    favoriteStores,
    isStoreCurrentlyOpen,
  } = props

  return (
    <div className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryGridClassName}>
      {storeCategories.map((category: CustomerRoleProps['storeCategories'][number]) => {
        const storesInCategory =
          category === CUSTOMER_FAVORITE_STORE_CATEGORY
            ? favoriteStores
            : visibleStores.filter((store: Store) => store.category === category)
        const openStoreCount = storesInCategory.filter(
          (store: Store) => isStoreCurrentlyOpen(store) && store.menu.length > ZERO_COUNT,
        ).length
        const isFavoriteCategory = category === CUSTOMER_FAVORITE_STORE_CATEGORY
        const categoryImageSrc = isFavoriteCategory
          ? CUSTOMER_FAVORITE_CATEGORY_IMAGE_SRC
          : getCategoryMeta(category).imageSrc
        const categorySubtitle = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryDescription
          : getCategoryMeta(category).subtitle
        const categoryTicketKind = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryTicketKind
          : CUSTOMER_STORE_BROWSE_COPY.categoryTicketKind
        const categoryButtonLabel = isFavoriteCategory
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryButton
          : CUSTOMER_STORE_BROWSE_COPY.chooseCategoryButton
        const categoryHint = isFavoriteCategory && storesInCategory.length === ZERO_COUNT
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryEmptyHint
          : categoryOrderableCoverageSummary(
              openStoreCount,
              storesInCategory.length,
            )

        return (
          <article key={category} className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryCardClassName}>
            <img
              alt={categoryImageAlt(category)}
              className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryImageClassName}
              src={categoryImageSrc}
            />
            <div className={DELIVERY_UI.ticketHeaderClassName}>
              <div>
                <p className={DELIVERY_UI.ticketKindClassName}>{categoryTicketKind}</p>
                <h3 className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryTitleClassName}>{category}</h3>
              </div>
              <span className={SELECTED_STORE_SECTIONS_LAYOUT.badgeClassName}>
                {`${storesInCategory.length}${CUSTOMER_STORE_BROWSE_COPY.categoryStoreCountSuffix}`}
              </span>
            </div>
            <p className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryDescriptionClassName}>{categorySubtitle}</p>
            <p className={DELIVERY_UI.metaLineClassName}>{categoryHint}</p>
            <button
              className={DELIVERY_UI.primaryButtonClassName}
              onClick={() => chooseStoreCategory(category)}
              type={DELIVERY_UI.buttonType}
            >
              {categoryButtonLabel}
            </button>
          </article>
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
  const {
    selectedStoreCategory,
    customerStoreSearch,
    setCustomerStoreSearch,
    resetStoreCategory,
    favoriteStoreIds,
    formatPrice,
    toggleBlockedStore,
    toggleFavoriteStore,
    formatStoreAvailability,
    formatAggregateRating,
    formatTime,
    isStoreCurrentlyOpen,
    enterStore,
    monthlyOrdersByStore,
    selectedCustomer,
    storeBrowseHighlights,
    storeCustomerReviews,
  } = props
  const referenceLocation = selectedCustomer?.location
  const sortedStores = storesToBrowse
    .slice()
    .sort((left: Store, right: Store) => {
      const distanceComparison =
        getStoreDeliveryQuote(left, referenceLocation).distanceKm -
        getStoreDeliveryQuote(right, referenceLocation).distanceKm
      const ratingComparison =
        right.averageRating - left.averageRating ||
        right.ratingCount - left.ratingCount

      return storeSortMode === CUSTOMER_STORE_SORT_MODE.rating
        ? ratingComparison || distanceComparison
        : distanceComparison || ratingComparison
    })
  const sortSummary =
    storeSortMode === CUSTOMER_STORE_SORT_MODE.rating
      ? CUSTOMER_STORE_BROWSE_COPY.sortedByRatingSummary
      : CUSTOMER_STORE_BROWSE_COPY.sortedByDistanceSummary

  return (
    <>
      <div className={CUSTOMER_STORE_BROWSE_LAYOUT.categoryToolbarClassName}>
        <div>
          <p className={DELIVERY_UI.ticketKindClassName}>
            {selectedStoreCategory
              ? CUSTOMER_STORE_BROWSE_COPY.currentCategoryLabel
              : CUSTOMER_STORE_BROWSE_COPY.searchResultLabel}
          </p>
          <strong>
            {selectedStoreCategory ||
              searchResultKeyword(customerStoreSearch.trim())}
          </strong>
          <p className={DELIVERY_UI.metaLineClassName}>
            {`${searchResultSummary(sortedStores.length)} · ${sortSummary}`}
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

      <div className={CUSTOMER_STORE_BROWSE_LAYOUT.compactStoreGridClassName}>
        {sortedStores.map((store: Store) => {
          const reviews = storeCustomerReviews[store.id] ?? []
          return (
            <CustomerStoreResultCard
              key={store.id}
              props={{
                enterStore,
                formatAggregateRating,
                formatPrice,
                formatStoreAvailability,
                formatTime,
                isStoreCurrentlyOpen,
                monthlyOrdersByStore,
                selectedCustomer,
                storeLocationStatus: storeLocationStatusMap?.[store.id],
                storeBrowseHighlights,
                favoriteStoreIds,
                toggleBlockedStore,
                toggleFavoriteStore,
              }}
              reviews={reviews.slice(ZERO_COUNT, CUSTOMER_STORE_RESULT_REVIEW_PREVIEW_COUNT)}
              store={store}
            />
          )
        })}
      </div>
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
