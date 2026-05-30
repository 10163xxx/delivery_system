import { StoreReviewList } from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { DisplayImageSlot } from '@/components/primitives/DisplayImageSlot'
import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/objects/customer/page/CustomerPageObjects'
import { CUSTOMER_STORE_RESULT_COPY } from '@/features/delivery/DeliveryMessages'
import { getStoreDeliveryQuote } from '@/features/delivery/DeliveryServices'

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

function getStoreBrowseButtonLabel(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
) {
  if (store.status === STORE_STATUS.revoked) return CUSTOMER_STORE_RESULT_COPY.unavailableStoreButton
  if (!isStoreCurrentlyOpen(store)) return CUSTOMER_STORE_RESULT_COPY.closedStoreButton
  if (store.menu.length === 0) return CUSTOMER_STORE_RESULT_COPY.emptyMenuButton
  if (!isDeliverable) return CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreButton
  return CUSTOMER_STORE_RESULT_COPY.enterStoreButton
}

export function CustomerStoreResultCard({
  store,
  reviews,
  props,
}: CustomerStoreBrowseResultCardProps) {
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
    toggleBlockedStore,
    toggleFavoriteStore,
  } = props
  const deliveryQuote = getStoreDeliveryQuote(store, selectedCustomer?.defaultAddress ?? '')
  const disabled =
    store.status === STORE_STATUS.revoked ||
    !isStoreCurrentlyOpen(store) ||
    store.menu.length === 0 ||
    !deliveryQuote.isDeliverable
  const highlights: string[] = storeBrowseHighlights[store.id] ?? []
  const isFavoriteStore = favoriteStoreIds.includes(store.id)

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
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.deliveryDistanceLabel}</p>
            <strong>{deliveryQuote.distanceLabel}</strong>
          </div>
          <div>
            <p>{CUSTOMER_STORE_RESULT_COPY.deliveryFeeLabel}</p>
            <strong>{formatPrice(deliveryQuote.deliveryFeeCents)}</strong>
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
          {!deliveryQuote.isDeliverable
            ? CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreHint
            : getStoreBrowseHint(store, isStoreCurrentlyOpen)}
        </p>
        <div className="action-row">
          <button
            className="primary-button"
            disabled={disabled}
            onClick={() => enterStore(store.id)}
            type="button"
          >
            {getStoreBrowseButtonLabel(store, isStoreCurrentlyOpen, deliveryQuote.isDeliverable)}
          </button>
          <button
            className="secondary-button"
            onClick={() => toggleFavoriteStore(store.id)}
            type="button"
          >
            {isFavoriteStore
              ? CUSTOMER_STORE_RESULT_COPY.unfavoriteStoreButton
              : CUSTOMER_STORE_RESULT_COPY.favoriteStoreButton}
          </button>
          <button
            className="secondary-button"
            onClick={() => toggleBlockedStore(store.id)}
            type="button"
          >
            {CUSTOMER_STORE_RESULT_COPY.blockStoreButton}
          </button>
        </div>
      </div>
    </article>
  )
}
