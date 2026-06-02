import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import type { Store } from '@/objects/core/SharedObjects'
import type { StoreLocationStatus } from '@/features/delivery/DeliveryStoreLocation'
import { CustomerStoreResultCard } from '@/pages/customer/store/CustomerStoreResultCard'
import { CUSTOMER_STORE_VISIBILITY } from '@/objects/page/DeliveryAppObjects'
import {
  CUSTOMER_STORE_RESULT_COPY,
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
} from '@/features/delivery/DeliveryMessages'
import {
  CUSTOMER_FAVORITE_STORE_CATEGORY,
  getStoreDeliveryQuote,
} from '@/features/delivery/DeliveryServices'

const SEARCH_HISTORY_WRAPPER_STYLE = {
  flex: 1,
} as const

const SEARCH_HISTORY_LIST_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryGap,
} as const

const SEARCH_HISTORY_ITEM_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryGap,
  padding: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryCardPadding,
  borderRadius: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryCardRadius,
  background: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryBackground,
  border: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryBorder,
} as const

const SEARCH_HISTORY_KEYWORD_BUTTON_STYLE = {
  flex: 1,
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
} as const

const SEARCH_HISTORY_REMOVE_BUTTON_STYLE = {
  border: 'none',
  background: 'transparent',
  padding: 0,
  fontSize: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryFontSize,
  lineHeight: 1,
  color: CUSTOMER_STORE_BROWSE_LAYOUT.searchHistoryTextColor,
  cursor: 'pointer',
} as const

export function StoreSearchBar({ props }: { props: CustomerRoleProps }) {
  const {
    customerStoreSearchDraft,
    customerStoreSearch,
    customerStoreVisibility,
    setCustomerStoreSearchDraft,
    setCustomerStoreSearch,
    setCustomerStoreVisibility,
    submitCustomerStoreSearch,
  } = props
  const showOrderableOnly =
    customerStoreVisibility === CUSTOMER_STORE_VISIBILITY.orderableOnly

  return (
    <div className="summary-bar">
      <label style={{ flex: 1, minWidth: CUSTOMER_STORE_BROWSE_LAYOUT.searchInputMinWidth }}>
        <span>{CUSTOMER_STORE_BROWSE_COPY.searchInputLabel}</span>
        <input
          placeholder={CUSTOMER_STORE_BROWSE_COPY.searchInputPlaceholder}
          value={customerStoreSearchDraft}
          onChange={(event) => setCustomerStoreSearchDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitCustomerStoreSearch()
            }
          }}
        />
      </label>
      <button className="primary-button" onClick={() => submitCustomerStoreSearch()} type="button">
        {CUSTOMER_STORE_BROWSE_COPY.searchButton}
      </button>
      {customerStoreSearchDraft.trim() || customerStoreSearch.trim() ? (
        <button
          className="secondary-button"
          onClick={() => {
            setCustomerStoreSearchDraft('')
            setCustomerStoreSearch('')
          }}
          type="button"
        >
          {CUSTOMER_STORE_BROWSE_COPY.searchClearButton}
        </button>
      ) : null}
      <button
        className={showOrderableOnly ? 'primary-button' : 'secondary-button'}
        onClick={() =>
          setCustomerStoreVisibility((current) =>
            current === CUSTOMER_STORE_VISIBILITY.orderableOnly
              ? CUSTOMER_STORE_VISIBILITY.all
              : CUSTOMER_STORE_VISIBILITY.orderableOnly,
          )
        }
        type="button"
      >
        {showOrderableOnly
          ? CUSTOMER_STORE_BROWSE_COPY.showOrderableOnlyButton
          : CUSTOMER_STORE_BROWSE_COPY.showAllStoresButton}
      </button>
    </div>
  )
}

export function SearchHistoryPanel({ props }: { props: CustomerRoleProps }) {
  const {
    customerStoreSearchHistory,
    removeCustomerStoreSearchHistoryItem,
    clearCustomerStoreSearchHistory,
    submitCustomerStoreSearch,
  } = props

  if (customerStoreSearchHistory.length === 0) return null

  return (
    <div className="summary-bar">
      <div style={SEARCH_HISTORY_WRAPPER_STYLE}>
        <p>{CUSTOMER_STORE_BROWSE_COPY.searchHistoryLabel}</p>
        <div style={SEARCH_HISTORY_LIST_STYLE}>
          {customerStoreSearchHistory.map((keyword: string) => (
            <div key={keyword} style={SEARCH_HISTORY_ITEM_STYLE}>
              <button
                type="button"
                onClick={() => submitCustomerStoreSearch(keyword)}
                style={SEARCH_HISTORY_KEYWORD_BUTTON_STYLE}
              >
                {keyword}
              </button>
              <button
                onClick={() => removeCustomerStoreSearchHistoryItem(keyword)}
                aria-label={CUSTOMER_STORE_BROWSE_COPY.searchHistoryDeleteLabel(keyword)}
                type="button"
                style={SEARCH_HISTORY_REMOVE_BUTTON_STYLE}
              >
                {CUSTOMER_STORE_BROWSE_COPY.searchHistoryRemoveButton}
              </button>
            </div>
          ))}
        </div>
      </div>
      <button
        className="secondary-button"
        onClick={() => clearCustomerStoreSearchHistory()}
        type="button"
      >
        {CUSTOMER_STORE_BROWSE_COPY.searchHistoryClearButton}
      </button>
    </div>
  )
}

export function RecentFrequentStoresPanel({ props }: { props: CustomerRoleProps }) {
  const {
    addPreviousOrderToCart,
    enterStore,
    favoriteStoreIds,
    formatTime,
    recentFrequentStores,
    repeatOrder,
    toggleBlockedStore,
    toggleFavoriteStore,
  } = props
  const visibleFrequentStores = recentFrequentStores.filter(
    (entry): entry is NonNullable<typeof entry> => entry != null,
  )
  const featuredFrequentStore = visibleFrequentStores[0] ?? null

  if (!featuredFrequentStore) return null

  return (
    <section className="recent-frequent-section">
      <div className="recent-frequent-strip">
        <div className="recent-frequent-heading">
          <p className="ticket-kind">{CUSTOMER_STORE_BROWSE_COPY.recentFrequentCardTitle}</p>
          <h3>{featuredFrequentStore.storeName}</h3>
        </div>
        <span className="badge success">
          {`${featuredFrequentStore.orderCount}${CUSTOMER_STORE_BROWSE_COPY.recentFrequentCountSuffix}`}
        </span>
        <p className="meta-line recent-frequent-meta">
          {`${featuredFrequentStore.category} · ${CUSTOMER_STORE_BROWSE_COPY.recentFrequentLastOrderedLabel} ${formatTime(featuredFrequentStore.lastOrderedAt)} · ${
            featuredFrequentStore.topItems.length > 0
              ? `${CUSTOMER_STORE_BROWSE_COPY.recentFrequentTopItemsPrefix}${featuredFrequentStore.topItems.join('、')}`
              : CUSTOMER_STORE_BROWSE_COPY.recentFrequentEmptyHint
          }`}
        </p>
        <div className="action-row recent-frequent-actions">
          <button
            className="primary-button recent-frequent-button"
            onClick={() => addPreviousOrderToCart(featuredFrequentStore.latestOrder)}
            type="button"
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentAddToCartButton}
          </button>
          <button
            className="secondary-button recent-frequent-button"
            onClick={() => repeatOrder(featuredFrequentStore.latestOrder)}
            type="button"
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentRepeatOrderButton}
          </button>
          <button
            className="secondary-button recent-frequent-button"
            onClick={() => enterStore(featuredFrequentStore.storeId)}
            disabled={!featuredFrequentStore.canOrder}
            type="button"
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentEnterStoreButton}
          </button>
          <button
            className="secondary-button recent-frequent-button"
            onClick={() => toggleFavoriteStore(featuredFrequentStore.storeId)}
            type="button"
          >
            {favoriteStoreIds.includes(featuredFrequentStore.storeId)
              ? CUSTOMER_STORE_RESULT_COPY.unfavoriteStoreButton
              : CUSTOMER_STORE_RESULT_COPY.favoriteStoreButton}
          </button>
          <button
            className="secondary-button recent-frequent-button"
            onClick={() => toggleBlockedStore(featuredFrequentStore.storeId)}
            type="button"
          >
            {CUSTOMER_STORE_RESULT_COPY.blockStoreButton}
          </button>
        </div>
      </div>
    </section>
  )
}

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
    <div className="store-grid">
      {storeCategories.map((category: CustomerRoleProps['storeCategories'][number]) => {
        const storesInCategory =
          category === CUSTOMER_FAVORITE_STORE_CATEGORY
            ? favoriteStores
            : visibleStores.filter((store: Store) => store.category === category)
        const openStoreCount = storesInCategory.filter(
          (store: Store) => isStoreCurrentlyOpen(store) && store.menu.length > 0,
        ).length
        const isFavoriteCategory = category === CUSTOMER_FAVORITE_STORE_CATEGORY
        const categoryImageSrc = isFavoriteCategory
          ? '/mascots/delivery-buddy.svg'
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
        const categoryHint = isFavoriteCategory && storesInCategory.length === 0
          ? CUSTOMER_STORE_BROWSE_COPY.favoriteCategoryEmptyHint
          : CUSTOMER_STORE_BROWSE_COPY.categoryOrderableCoverageSummary(
              openStoreCount,
              storesInCategory.length,
            )

        return (
          <article key={category} className="store-card category-card">
            <img
              alt={CUSTOMER_STORE_BROWSE_COPY.categoryImageAlt(category)}
              className="category-image"
              src={categoryImageSrc}
            />
            <div className="ticket-header">
              <div>
                <p className="ticket-kind">{categoryTicketKind}</p>
                <h3 className="category-title">{category}</h3>
              </div>
              <span className="badge">
                {`${storesInCategory.length}${CUSTOMER_STORE_BROWSE_COPY.categoryStoreCountSuffix}`}
              </span>
            </div>
            <p className="category-description">{categorySubtitle}</p>
            <p className="meta-line">{categoryHint}</p>
            <button
              className="primary-button"
              onClick={() => chooseStoreCategory(category)}
              type="button"
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
  storesToBrowse,
}: {
  props: CustomerRoleProps
  storeLocationStatusMap?: Record<string, StoreLocationStatus>
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
  const distanceSortedStores = storesToBrowse
    .slice()
    .sort(
      (left: Store, right: Store) =>
          getStoreDeliveryQuote(left, referenceLocation).distanceKm - getStoreDeliveryQuote(right, referenceLocation).distanceKm ||
        right.averageRating - left.averageRating ||
        right.ratingCount - left.ratingCount,
    )

  return (
    <>
      <div className="category-toolbar">
        <div>
          <p className="ticket-kind">
            {selectedStoreCategory
              ? CUSTOMER_STORE_BROWSE_COPY.currentCategoryLabel
              : CUSTOMER_STORE_BROWSE_COPY.searchResultLabel}
          </p>
          <strong>
            {selectedStoreCategory ||
              CUSTOMER_STORE_BROWSE_COPY.searchResultKeyword(customerStoreSearch.trim())}
          </strong>
          <p className="meta-line">
            {`${CUSTOMER_STORE_BROWSE_COPY.searchResultSummary(distanceSortedStores.length)} · 已按配送距离由近到远排序`}
          </p>
        </div>
        <button
          className="primary-button category-back-button"
          onClick={() => {
            if (selectedStoreCategory) {
              resetStoreCategory()
            } else {
              setCustomerStoreSearch('')
            }
          }}
          style={{
            minWidth: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonMinWidth,
            minHeight: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonMinHeight,
            fontSize: CUSTOMER_STORE_BROWSE_COPY.resultToolbarButtonFontSize,
          }}
          type="button"
        >
          {selectedStoreCategory
            ? CUSTOMER_STORE_BROWSE_COPY.backToAllCategoriesButton
            : CUSTOMER_STORE_BROWSE_COPY.clearSearchResultButton}
        </button>
      </div>

      <div className="store-grid compact-store-grid">
        {distanceSortedStores.map((store: Store) => {
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
              reviews={reviews.slice(0, 2)}
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
    <div className="empty-card">
      {customerStoreSearch.trim()
        ? CUSTOMER_STORE_BROWSE_COPY.emptySearchResult
        : props.selectedStoreCategory === CUSTOMER_FAVORITE_STORE_CATEGORY
          ? CUSTOMER_STORE_BROWSE_COPY.emptyFavoriteCategoryResult
        : showOrderableOnly
          ? CUSTOMER_STORE_BROWSE_COPY.switchToAllStoresHint
          : CUSTOMER_STORE_BROWSE_COPY.emptyCategoryResult}
      <button className="secondary-button" onClick={() => resetStoreCategory()} type="button">
        {CUSTOMER_STORE_BROWSE_COPY.backToCategoryListButton}
      </button>
    </div>
  )
}
