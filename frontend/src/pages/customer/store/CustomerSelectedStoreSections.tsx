import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import type { MenuItem } from '@/shared/object/core/SharedObjects'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab } from '@/pages/customer/object/CustomerPageObjects'
import {
  MAX_RATING,
  MILLISECONDS_PER_DAY,
  MIN_RATING,
} from '@/shared/delivery/DeliveryConstants'
import { StoreReviewList } from '@/pages/customer/store/CustomerSelectedStorePanel'
import {
  SELECTED_STORE_SECTIONS_COPY,
  SELECTED_STORE_SECTIONS_LAYOUT,
} from '@/shared/delivery/DeliveryMessages'

const STORE_REVIEW_DAY_FILTER = {
  all: 0,
  recentWeek: 7,
  recentMonth: 30,
  recentQuarter: 90,
} as const

const STORE_REVIEW_DAY_FILTER_OPTIONS = [
  { value: STORE_REVIEW_DAY_FILTER.all, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterAllLabel },
  { value: STORE_REVIEW_DAY_FILTER.recentWeek, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentWeekLabel },
  { value: STORE_REVIEW_DAY_FILTER.recentMonth, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentMonthLabel },
  { value: STORE_REVIEW_DAY_FILTER.recentQuarter, label: SELECTED_STORE_SECTIONS_COPY.reviewDayFilterRecentQuarterLabel },
] as const

const STORE_REVIEW_STAR_FILTER_OPTIONS = [
  { value: 0, label: SELECTED_STORE_SECTIONS_COPY.reviewAllStarLabel },
  ...Array.from({ length: MAX_RATING - MIN_RATING + 1 }, (_, index) => {
    const rating = MAX_RATING - index
    return { value: rating, label: SELECTED_STORE_SECTIONS_COPY.reviewStarOptionLabel(rating) }
  }),
] as const

export function SelectedStoreToolbar({ props }: { props: CustomerRoleProps }) {
  const { selectedStore, formatStoreAvailability, formatBusinessHours, formatAggregateRating, leaveStore, resetStoreCategory, quantities } = props
  if (!selectedStore) return null

  return (
    <div className="store-toolbar">
      <div>
        <p className="ticket-kind">{SELECTED_STORE_SECTIONS_COPY.currentStoreLabel}</p>
        <strong>{selectedStore.name}</strong>
        <p className="meta-line">{selectedStore.category} · {formatStoreAvailability(selectedStore)}</p>
        <p className="meta-line">
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
        <strong>{selectedStore.menu.reduce((sum: number, item: MenuItem) => sum + (quantities[item.id] ?? 0), 0)}</strong>
      </div>
      <button
        className="secondary-button store-back-button"
        onClick={() => leaveStore()}
        style={{
          minWidth: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinWidth,
          minHeight: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinHeight,
          fontSize: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonFontSize,
        }}
        type="button"
      >
        {SELECTED_STORE_SECTIONS_COPY.backToCurrentCategoryButton}
      </button>
      <button
        className="primary-button store-reset-button"
        onClick={() => resetStoreCategory()}
        style={{
          minWidth: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinWidth,
          minHeight: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonMinHeight,
          fontSize: SELECTED_STORE_SECTIONS_LAYOUT.toolbarButtonFontSize,
        }}
        type="button"
      >
        {SELECTED_STORE_SECTIONS_COPY.resetCategoryButton}
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
  return (
    <div
      className="store-detail-tabs"
      role="tablist"
      aria-label={SELECTED_STORE_SECTIONS_COPY.tabListAriaLabel(selectedStoreName)}
    >
      <button
        aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.menu}
        className={`store-detail-tab ${selectedStoreTab === CUSTOMER_STORE_TAB.menu ? 'is-active' : ''}`}
        onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.menu)}
        role="tab"
        type="button"
      >
        {SELECTED_STORE_SECTIONS_COPY.menuTabButton}
      </button>
      <button
        aria-selected={selectedStoreTab === CUSTOMER_STORE_TAB.reviews}
        className={`store-detail-tab ${selectedStoreTab === CUSTOMER_STORE_TAB.reviews ? 'is-active' : ''}`}
        onClick={() => setSelectedStoreTab(CUSTOMER_STORE_TAB.reviews)}
        role="tab"
        type="button"
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
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [selectedRecentDays, setSelectedRecentDays] = useState<number>(STORE_REVIEW_DAY_FILTER.all)

  useEffect(() => {
    setSelectedRating(0)
    setSelectedRecentDays(STORE_REVIEW_DAY_FILTER.all)
  }, [selectedStore.id])

  const now = Date.now()
  const filteredReviews = reviews.filter((review) => {
    const matchesRating = selectedRating === 0 || review.rating === selectedRating
    const matchesRecentDays =
      selectedRecentDays === STORE_REVIEW_DAY_FILTER.all ||
      now - new Date(review.completedAt).getTime() <=
        selectedRecentDays * MILLISECONDS_PER_DAY

    return matchesRating && matchesRecentDays
  })

  return (
    <section className="store-review-panel">
      <div className="panel-header">
        <div>
          <p className="ticket-kind">{SELECTED_STORE_SECTIONS_COPY.reviewPanelTicketKind}</p>
          <h3>{selectedStore.name}</h3>
          <p className="meta-line">{SELECTED_STORE_SECTIONS_COPY.reviewPanelDescription}</p>
        </div>
        <span className="badge">
          {reviews.length}
          {SELECTED_STORE_SECTIONS_COPY.reviewCountSuffix}
        </span>
      </div>
      <div className="summary-bar">
        <label>
          <span>{SELECTED_STORE_SECTIONS_COPY.reviewRatingFilterLabel}</span>
          <select
            value={selectedRating}
            onChange={(event) => setSelectedRating(Number(event.target.value))}
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
            onChange={(event) => setSelectedRecentDays(Number(event.target.value))}
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
