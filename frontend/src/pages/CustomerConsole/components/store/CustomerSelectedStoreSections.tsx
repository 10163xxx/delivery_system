import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import { getSelectedCartLines } from '@/pages/DeliveryConsole/functions/cart/DeliveryCartLines'
import {
  ALL_REVIEW_RATING_FILTER,
  CUSTOMER_REVIEW_FILTER_DAYS,
  INCLUSIVE_RANGE_BOUNDARY_OFFSET,
  type CustomerReviewFilterDay,
  MAX_RATING,
  MILLISECONDS_PER_DAY,
  MIN_RATING,
  parseCustomerReviewFilterDay,
  parseReviewRatingFilter,
  type ReviewRatingFilter,
  ZERO_COUNT,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { StoreReviewList } from '@/pages/CustomerConsole/components/store/CustomerSelectedStorePanel'
import {
  DELIVERY_UI,
  SELECTED_STORE_COPY,
  SELECTED_STORE_SECTIONS_COPY,
  SELECTED_STORE_SECTIONS_LAYOUT,
  formatReviewStarOptionLabel,
  formatSelectedStoreTabListAriaLabel,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'

const STORE_REVIEW_RATING_OPTION_COUNT =
  MAX_RATING - MIN_RATING + INCLUSIVE_RANGE_BOUNDARY_OFFSET

const STORE_REVIEW_DAY_FILTER_OPTIONS = [
  { value: CUSTOMER_REVIEW_FILTER_DAYS.all, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterAllLabel },
  { value: CUSTOMER_REVIEW_FILTER_DAYS.recentWeek, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentWeekLabel },
  { value: CUSTOMER_REVIEW_FILTER_DAYS.recentMonth, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentMonthLabel },
  { value: CUSTOMER_REVIEW_FILTER_DAYS.recentQuarter, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentQuarterLabel },
] as const

const STORE_REVIEW_STAR_FILTER_OPTIONS = [
  { value: ALL_REVIEW_RATING_FILTER, label: SELECTED_STORE_SECTIONS_COPY.reviewAllStarLabel },
  ...Array.from({ length: STORE_REVIEW_RATING_OPTION_COUNT }, (_, index) => {
    const rating = MAX_RATING - index
    return { value: rating, label: formatReviewStarOptionLabel(rating) }
  }),
] as const

export function SelectedStoreToolbar({ props }: { props: CustomerRoleProps }) {
  const {
    selectedStore,
    favoriteStoreIds,
    formatStoreAvailability,
    formatBusinessHours,
    formatAggregateRating,
    leaveStore,
    resetStoreCategory,
    quantities,
    selectedMenuItemConfigurations,
    toggleBlockedStore,
    toggleFavoriteStore,
  } = props
  if (!selectedStore) return null
  const isFavoriteStore = favoriteStoreIds.includes(selectedStore.id)

  return (
    <div className={SELECTED_STORE_SECTIONS_LAYOUT.storeToolbarClassName}>
      <div>
        <p className={DELIVERY_UI.ticketKindClassName}>{SELECTED_STORE_SECTIONS_COPY.currentStoreLabel}</p>
        <strong>{selectedStore.name}</strong>
        <p className={DELIVERY_UI.metaLineClassName}>{selectedStore.category} · {formatStoreAvailability(selectedStore)}</p>
        <p className={DELIVERY_UI.metaLineClassName}>
          {SELECTED_STORE_SECTIONS_COPY.businessHoursPrefix}
          {formatBusinessHours(selectedStore.businessHours)}
        </p>
      </div>
      <div>
        <p>店铺评分</p>
        <strong>{formatAggregateRating(selectedStore.averageRating, selectedStore.ratingCount)}</strong>
      </div>
      <div>
        <p>{SELECTED_STORE_SECTIONS_COPY.selectedItemsLabel}</p>
        <strong>{getSelectedCartLines(selectedStore, quantities, selectedMenuItemConfigurations).reduce((sum, line) => sum + line.quantity, ZERO_COUNT)}</strong>
      </div>
      <button
        className={SELECTED_STORE_SECTIONS_LAYOUT.toolbarBackButtonClassName}
        onClick={() => leaveStore()}
        style={{
          minWidth: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinWidth,
          minHeight: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinHeight,
          fontSize: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonFontSize,
        }}
        type={DELIVERY_UI.buttonType}
      >
        {SELECTED_STORE_SECTIONS_COPY.backToCurrentCategoryButton}
      </button>
      <button
        className={SELECTED_STORE_SECTIONS_LAYOUT.toolbarResetButtonClassName}
        onClick={() => resetStoreCategory()}
        style={{
          minWidth: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinWidth,
          minHeight: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinHeight,
          fontSize: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonFontSize,
        }}
        type={DELIVERY_UI.buttonType}
      >
        {SELECTED_STORE_SECTIONS_COPY.resetCategoryButton}
      </button>
      <button
        className={DELIVERY_UI.secondaryButtonClassName}
        onClick={() => toggleFavoriteStore(selectedStore.id)}
        type={DELIVERY_UI.buttonType}
      >
        {isFavoriteStore
          ? SELECTED_STORE_COPY.unfavoriteStoreButton
          : SELECTED_STORE_COPY.favoriteStoreButton}
      </button>
      <button
        className={DELIVERY_UI.secondaryButtonClassName}
        onClick={() => toggleBlockedStore(selectedStore.id)}
        type={DELIVERY_UI.buttonType}
      >
        {SELECTED_STORE_COPY.blockStoreButton}
      </button>
    </div>
  )
}

export function SelectedStoreTabs({
  selectedStoreName,
  selectedStoreTab,
  setSelectedStoreTab,
}: {
  selectedStoreName: string
  selectedStoreTab: CustomerStoreTab
  setSelectedStoreTab: Dispatch<SetStateAction<CustomerStoreTab>>
}) {
  const menuTabStateClass =
    selectedStoreTab === CUSTOMER_STORE_TAB.menu
      ? SELECTED_STORE_SECTIONS_LAYOUT.activeTabClassName
      : SELECTED_STORE_SECTIONS_LAYOUT.tabClassName
  const reviewsTabStateClass =
    selectedStoreTab === CUSTOMER_STORE_TAB.reviews
      ? SELECTED_STORE_SECTIONS_LAYOUT.activeTabClassName
      : SELECTED_STORE_SECTIONS_LAYOUT.tabClassName

  return (
    <div
      className={SELECTED_STORE_SECTIONS_LAYOUT.tabsClassName}
      role={DELIVERY_UI.roleTabList}
      aria-label={formatSelectedStoreTabListAriaLabel(selectedStoreName)}
    >
      <button
        aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.menu}
        className={menuTabStateClass}
        onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.menu)}
        role={DELIVERY_UI.roleTab}
        type={DELIVERY_UI.buttonType}
      >
        {SELECTED_STORE_SECTIONS_COPY.menuTabButton}
      </button>
      <button
        aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.reviews}
        className={reviewsTabStateClass}
        onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.reviews)}
        role={DELIVERY_UI.roleTab}
        type={DELIVERY_UI.buttonType}
      >
        {SELECTED_STORE_SECTIONS_COPY.reviewTabButton}
      </button>
    </div>
  )
}

export function SelectedStoreReviewSection({ props }: { props: CustomerRoleProps }) {
  const { selectedStore, formatTime, storeCustomerReviews } = props
  if (!selectedStore) return null
  const reviews = storeCustomerReviews[selectedStore.id] ?? []
  const [selectedRating, setSelectedRating] = useState<ReviewRatingFilter>(ALL_REVIEW_RATING_FILTER)
  const [selectedRecentDays, setSelectedRecentDays] = useState<CustomerReviewFilterDay>(CUSTOMER_REVIEW_FILTER_DAYS.all)

  useEffect(() => {
    setSelectedRating(ALL_REVIEW_RATING_FILTER)
    setSelectedRecentDays(CUSTOMER_REVIEW_FILTER_DAYS.all)
  }, [selectedStore.id])

  const now = Date.now()
  const filteredReviews = reviews.filter((review) => {
    const matchesRating = selectedRating === ALL_REVIEW_RATING_FILTER || review.rating === selectedRating
    const matchesRecentDays =
      selectedRecentDays === CUSTOMER_REVIEW_FILTER_DAYS.all ||
      now - new Date(review.completedAt).getTime() <=
        selectedRecentDays * MILLISECONDS_PER_DAY

    return matchesRating && matchesRecentDays
  })

  return (
    <section className={SELECTED_STORE_SECTIONS_LAYOUT.reviewPanelClassName}>
      <div className={DELIVERY_UI.panelHeaderClassName}>
        <div>
          <p className={DELIVERY_UI.ticketKindClassName}>{SELECTED_STORE_SECTIONS_COPY.reviewPanelTicketKind}</p>
          <h3>{selectedStore.name}</h3>
          <p className={DELIVERY_UI.metaLineClassName}>{SELECTED_STORE_SECTIONS_COPY.reviewPanelDescription}</p>
        </div>
        <span className={SELECTED_STORE_SECTIONS_LAYOUT.badgeClassName}>
          {reviews.length}
          {SELECTED_STORE_SECTIONS_COPY.reviewCountSuffix}
        </span>
      </div>
      <div className={DELIVERY_UI.summaryBarClassName}>
        <label>
          <span>{SELECTED_STORE_SECTIONS_COPY.reviewRatingFilterLabel}</span>
          <select
            value={selectedRating}
            onChange={(event) => setSelectedRating(parseReviewRatingFilter(event.target.value))}
          >
            {STORE_REVIEW_STAR_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{SELECTED_STORE_SECTIONS_COPY.reviewTimeFilterLabel}</span>
          <select
            value={selectedRecentDays}
            onChange={(event) => setSelectedRecentDays(parseCustomerReviewFilterDay(event.target.value))}
          >
            {STORE_REVIEW_DAY_FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <div>
          <span>{SELECTED_STORE_SECTIONS_COPY.reviewCurrentResultLabel}</span>
          <strong>
            {filteredReviews.length} / {reviews.length}
          </strong>
        </div>
      </div>
      <StoreReviewList
        emptyText={SELECTED_STORE_SECTIONS_COPY.filteredReviewEmptyText}
        formatTime={formatTime}
        reviews={filteredReviews}
      />
    </section>
  )
}
