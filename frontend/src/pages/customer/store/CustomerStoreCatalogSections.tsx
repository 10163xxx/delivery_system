import type { CustomerRoleProps } from '@/shared/app/role-props'
import { ACCOUNT_STATUS, type Store } from '@/shared/object/core/SharedObjects'
import { CustomerStoreResultCard } from '@/pages/customer/store/CustomerStoreResultCard'
import type { RecentFrequentStore } from '@/pages/customer/object/CustomerPageObjects'
import { CUSTOMER_STORE_VISIBILITY } from '@/shared/object/core/DeliveryAppObjects'
import {
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
} from '@/shared/delivery/DeliveryMessages'

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

export function CustomerStatusBar({ props }: { props: CustomerRoleProps }) {
  const { selectedCustomer } = props

  if (!selectedCustomer) return null

  return (
    <div className="summary-bar">
      <div>
        <p>{CUSTOMER_STORE_BROWSE_COPY.customerStatusLabel}</p>
        <strong>
          {selectedCustomer.accountStatus === ACCOUNT_STATUS.suspended
            ? CUSTOMER_STORE_BROWSE_COPY.customerStatusSuspended
            : CUSTOMER_STORE_BROWSE_COPY.customerStatusActive}
        </strong>
      </div>
      <div>
        <p>{CUSTOMER_STORE_BROWSE_COPY.reviewRevokedCountLabel}</p>
        <strong>{selectedCustomer.revokedReviewCount}</strong>
      </div>
    </div>
  )
}

export function RecentFrequentStoresPanel({ props }: { props: CustomerRoleProps }) {
  const {
    addPreviousOrderToCart,
    enterStore,
    formatTime,
    recentFrequentStores,
    repeatOrder,
  } = props
  const visibleFrequentStores = recentFrequentStores.filter(
    (entry): entry is NonNullable<typeof entry> => entry != null,
  )

  if (visibleFrequentStores.length === 0) return null

  return (
    <section className="order-section-card">
      <div className="order-section-header">
        <div>
          <p className="ticket-kind">{CUSTOMER_STORE_BROWSE_COPY.recentFrequentCardTitle}</p>
          <h3>{CUSTOMER_STORE_BROWSE_COPY.recentFrequentSectionSubtitle}</h3>
        </div>
      </div>
      <div className="store-grid compact-store-grid">
        {visibleFrequentStores.map((entry: RecentFrequentStore) => (
          <article key={entry.storeId} className="store-card compact-store-card">
            <div className="compact-store-content">
              <div className="ticket-header">
                <div>
                  <p className="ticket-kind">{entry.category}</p>
                  <h3>{entry.storeName}</h3>
                </div>
                <span className="badge success">
                  {`${entry.orderCount}${CUSTOMER_STORE_BROWSE_COPY.recentFrequentCountSuffix}`}
                </span>
              </div>
              <div className="summary-bar compact-store-summary">
                <div>
                  <p>{CUSTOMER_STORE_BROWSE_COPY.recentFrequentLastOrderedLabel}</p>
                  <strong>{formatTime(entry.lastOrderedAt)}</strong>
                </div>
                <div>
                  <p>{CUSTOMER_STORE_BROWSE_COPY.recentFrequentTopItemsLabel}</p>
                  <strong>{entry.topItems.length}</strong>
                </div>
              </div>
              <p className="meta-line">
                {entry.topItems.length > 0
                  ? `${CUSTOMER_STORE_BROWSE_COPY.recentFrequentTopItemsPrefix}${entry.topItems.join('、')}`
                  : CUSTOMER_STORE_BROWSE_COPY.recentFrequentEmptyHint}
              </p>
              <div className="action-row">
                <button
                  className="primary-button"
                  onClick={() => addPreviousOrderToCart(entry.latestOrder)}
                  type="button"
                >
                  {CUSTOMER_STORE_BROWSE_COPY.recentFrequentAddToCartButton}
                </button>
                <button
                  className="secondary-button"
                  onClick={() => repeatOrder(entry.latestOrder)}
                  type="button"
                >
                  {CUSTOMER_STORE_BROWSE_COPY.recentFrequentRepeatOrderButton}
                </button>
                <button
                  className="secondary-button"
                  onClick={() => enterStore(entry.storeId)}
                  disabled={!entry.canOrder}
                  type="button"
                >
                  {CUSTOMER_STORE_BROWSE_COPY.recentFrequentEnterStoreButton}
                </button>
              </div>
            </div>
          </article>
        ))}
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
    isStoreCurrentlyOpen,
  } = props

      return (
    <div className="store-grid">
      {storeCategories.map((category: CustomerRoleProps['storeCategories'][number]) => {
        const storesInCategory = visibleStores.filter((store: Store) => store.category === category)
        const openStoreCount = storesInCategory.filter(
          (store: Store) => isStoreCurrentlyOpen(store) && store.menu.length > 0,
        ).length

        return (
          <article key={category} className="store-card category-card">
            <img
              alt={CUSTOMER_STORE_BROWSE_COPY.categoryImageAlt(category)}
              className="category-image"
              src={getCategoryMeta(category).imageSrc}
            />
            <div className="ticket-header">
              <div>
                <p className="ticket-kind">{CUSTOMER_STORE_BROWSE_COPY.categoryTicketKind}</p>
                <h3 className="category-title">{category}</h3>
              </div>
              <span className="badge">
                {`${storesInCategory.length}${CUSTOMER_STORE_BROWSE_COPY.categoryStoreCountSuffix}`}
              </span>
            </div>
            <p className="category-description">{getCategoryMeta(category).subtitle}</p>
            <p className="meta-line">
              {CUSTOMER_STORE_BROWSE_COPY.categoryOrderableCoverageSummary(
                openStoreCount,
                storesInCategory.length,
              )}
            </p>
            <button
              className="primary-button"
              onClick={() => chooseStoreCategory(category)}
              type="button"
            >
              {CUSTOMER_STORE_BROWSE_COPY.chooseCategoryButton}
            </button>
          </article>
        )
      })}
    </div>
  )
}

export function StoreResultsGrid({
  props,
  storesToBrowse,
}: {
  props: CustomerRoleProps
  storesToBrowse: Store[]
}) {
  const {
    selectedStoreCategory,
    customerStoreSearch,
    setCustomerStoreSearch,
    resetStoreCategory,
    formatStoreAvailability,
    formatAggregateRating,
    formatTime,
    isStoreCurrentlyOpen,
    enterStore,
    monthlyOrdersByStore,
    storeBrowseHighlights,
    storeCustomerReviews,
  } = props

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
            {CUSTOMER_STORE_BROWSE_COPY.searchResultSummary(storesToBrowse.length)}
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
        {storesToBrowse.map((store: Store) => {
          const reviews = storeCustomerReviews[store.id] ?? []
          return (
            <CustomerStoreResultCard
              key={store.id}
              props={{
                enterStore,
                formatAggregateRating,
                formatStoreAvailability,
                formatTime,
                isStoreCurrentlyOpen,
                monthlyOrdersByStore,
                storeBrowseHighlights,
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
        : showOrderableOnly
          ? CUSTOMER_STORE_BROWSE_COPY.switchToAllStoresHint
          : CUSTOMER_STORE_BROWSE_COPY.emptyCategoryResult}
      <button className="secondary-button" onClick={() => resetStoreCategory()} type="button">
        {CUSTOMER_STORE_BROWSE_COPY.backToCategoryListButton}
      </button>
    </div>
  )
}
