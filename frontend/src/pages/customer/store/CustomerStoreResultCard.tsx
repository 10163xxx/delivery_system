import { StoreReviewList } from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import { DisplayImageSlot } from '@/shared/components/primitives/DisplayImageSlot'
import { STORE_STATUS, type Store } from '@/shared/object/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/customer/object/CustomerPageObjects'
import { CUSTOMER_STORE_RESULT_COPY } from '@/shared/delivery/DeliveryMessages'

function getStoreBrowseHint(store: Store, isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']) {
  if (store.status === STORE_STATUS.revoked) {
    return CUSTOMER_STORE_RESULT_COPY.unavailableStoreHint
  }
  if (!isStoreCurrentlyOpen(store)) {
    return CUSTOMER_STORE_RESULT_COPY.closedStoreHint
  }
  if (store.menu.length === 0) {
    return CUSTOMER_STORE_RESULT_COPY.emptyMenuHint
  }
  return CUSTOMER_STORE_RESULT_COPY.availableStoreHint
}

function getStoreBrowseButtonLabel(store: Store, isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen']) {
  if (store.status === STORE_STATUS.revoked) return CUSTOMER_STORE_RESULT_COPY.unavailableStoreButton
  if (!isStoreCurrentlyOpen(store)) return CUSTOMER_STORE_RESULT_COPY.closedStoreButton
  if (store.menu.length === 0) return CUSTOMER_STORE_RESULT_COPY.emptyMenuButton
  return CUSTOMER_STORE_RESULT_COPY.enterStoreButton
}

export function CustomerStoreResultCard({
  store,
  reviews,
  props,
}: CustomerStoreBrowseResultCardProps) {
  const {
    enterStore,
    formatAggregateRating,
    formatStoreAvailability,
    formatTime,
    isStoreCurrentlyOpen,
    monthlyOrdersByStore,
    storeBrowseHighlights,
  } = props
  const disabled =
    store.status === STORE_STATUS.revoked || !isStoreCurrentlyOpen(store) || store.menu.length === 0
  const highlights: string[] = storeBrowseHighlights[store.id] ?? []

  return (
    <article className="store-card compact-store-card">
      <DisplayImageSlot
        alt={CUSTOMER_STORE_RESULT_COPY.storeImageAlt(store.name)}
        className="store-image compact-store-image"
        label={CUSTOMER_STORE_RESULT_COPY.storeImageLabel}
        src={store.imageUrl}
      />
      <div className="compact-store-content">
        <div className="ticket-header">
          <div>
            <p className="ticket-kind">{store.category}</p>
            <h3>{store.name}</h3>
          </div>
          <span className={store.status === STORE_STATUS.revoked ? 'badge warning' : 'badge success'}>
            {formatStoreAvailability(store)}
          </span>
        </div>
        <div className="summary-bar compact-store-summary">
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.storeRatingLabel}</p>
            <strong>{formatAggregateRating(store.averageRating, store.ratingCount)}</strong>
          </div>
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.menuCountLabel}</p>
            <strong>{`${store.menu.length}${CUSTOMER_STORE_RESULT_COPY.menuCountSuffix}`}</strong>
          </div>
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.recentMonthOrderLabel}</p>
            <strong>
              {`${monthlyOrdersByStore[store.id] ?? 0}${CUSTOMER_STORE_RESULT_COPY.recentMonthOrderSuffix}`}
            </strong>
          </div>
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.prepSpeedLabel}</p>
            <strong>{`${store.avgPrepMinutes}${CUSTOMER_STORE_RESULT_COPY.prepSpeedSuffix}`}</strong>
          </div>
        </div>
        {highlights.length > 0 ? (
          <div
            className="store-highlight-list"
            aria-label={CUSTOMER_STORE_RESULT_COPY.highlightListAriaLabel(store.name)}
          >
            {highlights.map((highlight: string) => (
              <span key={highlight} className="store-highlight-chip">
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
        <div className="compact-store-reviews">
          <p className="ticket-kind">{CUSTOMER_STORE_RESULT_COPY.reviewSectionLabel}</p>
          <StoreReviewList
            emptyText={CUSTOMER_STORE_RESULT_COPY.reviewEmptyText}
            formatTime={formatTime}
            reviews={reviews}
            variant="compact"
          />
        </div>
        <p className="meta-line compact-store-hint">
          {getStoreBrowseHint(store, isStoreCurrentlyOpen)}
        </p>
        <button
          className="primary-button"
          disabled={disabled}
          onClick={() => enterStore(store.id)}
          type="button"
        >
          {getStoreBrowseButtonLabel(store, isStoreCurrentlyOpen)}
        </button>
      </div>
    </article>
  )
}
