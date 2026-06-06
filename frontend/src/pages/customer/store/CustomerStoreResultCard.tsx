import {
  STORE_REVIEW_LIST_VARIANT,
  StoreReviewList,
} from '@/pages/customer/store/CustomerSelectedStorePanel'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { DisplayImageSlot } from '@/components/primitives/DisplayImageSlot'
import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/customer/objects/CustomerPageObjects'
import {
  CUSTOMER_STORE_RESULT_LAYOUT,
  CUSTOMER_STORE_RESULT_COPY,
  formatStoreHighlightListAriaLabel,
  formatStoreImageAlt,
  DELIVERY_UI,
} from '@/features/delivery/DeliveryMessages'
import { ZERO_COUNT } from '@/features/delivery/DeliveryConstants'
import { getStoreDeliveryQuote } from '@/features/delivery/DeliveryServices'
import {
  isStoreLocated,
  type StoreLocationStatus,
  useStoreLocationStatus,
} from '@/features/delivery/DeliveryStoreLocation'

function getStoreBrowseHint(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  locationStatus: StoreLocationStatus,
) {
  if (!isStoreLocated(locationStatus)) return CUSTOMER_STORE_RESULT_COPY.locationUnavailableHint
  if (store.status === STORE_STATUS.revoked) {
    return CUSTOMER_STORE_RESULT_COPY.unavailableStoreHint
  }
  if (!isStoreCurrentlyOpen(store)) {
    return CUSTOMER_STORE_RESULT_COPY.closedStoreHint
  }
  if (store.menu.length === ZERO_COUNT) {
    return CUSTOMER_STORE_RESULT_COPY.emptyMenuHint
  }
  return CUSTOMER_STORE_RESULT_COPY.availableStoreHint
}

function getStoreBrowseButtonLabel(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  if (!isStoreLocated(locationStatus)) return CUSTOMER_STORE_RESULT_COPY.locationUnavailableButton
  if (store.status === STORE_STATUS.revoked) return CUSTOMER_STORE_RESULT_COPY.unavailableStoreButton
  if (!isStoreCurrentlyOpen(store)) return CUSTOMER_STORE_RESULT_COPY.closedStoreButton
  if (store.menu.length === ZERO_COUNT) return CUSTOMER_STORE_RESULT_COPY.emptyMenuButton
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
    storeLocationStatus,
  } = props
  const resolvedLocationStatus = useStoreLocationStatus(store)
  const locationStatus = storeLocationStatus ?? resolvedLocationStatus
  const deliveryQuote = getStoreDeliveryQuote(store, selectedCustomer?.location)
  const disabled =
    !isStoreLocated(locationStatus) ||
    store.status === STORE_STATUS.revoked ||
    !isStoreCurrentlyOpen(store) ||
    store.menu.length === ZERO_COUNT ||
    !deliveryQuote.isDeliverable
  const highlights: string[] = storeBrowseHighlights[store.id] ?? []
  const isFavoriteStore = favoriteStoreIds.includes(store.id)

  return (
    <article className={CUSTOMER_STORE_RESULT_LAYOUT.articleClassName}>
      <DisplayImageSlot
        alt={formatStoreImageAlt(store.name)}
        className={CUSTOMER_STORE_RESULT_LAYOUT.imageClassName}
        label={CUSTOMER_STORE_RESULT_COPY.storeImageLabel}
        src={store.imageUrl}
      />
      <div className={CUSTOMER_STORE_RESULT_LAYOUT.contentClassName}>
        <div className={DELIVERY_UI.ticketHeaderClassName}>
          <div>
            <p className={DELIVERY_UI.ticketKindClassName}>{store.category}</p>
            <h3>{store.name}</h3>
          </div>
          <span className={store.status === STORE_STATUS.revoked ? CUSTOMER_STORE_RESULT_LAYOUT.warningBadgeClassName : CUSTOMER_STORE_RESULT_LAYOUT.successBadgeClassName}>
            {formatStoreAvailability(store)}
          </span>
        </div>
        <div className={CUSTOMER_STORE_RESULT_LAYOUT.summaryClassName}>
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
              {`${monthlyOrdersByStore[store.id] ?? ZERO_COUNT}${CUSTOMER_STORE_RESULT_COPY.recentMonthOrderSuffix}`}
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
        {highlights.length > ZERO_COUNT ? (
          <div
            className={CUSTOMER_STORE_RESULT_LAYOUT.highlightListClassName}
            aria-label={formatStoreHighlightListAriaLabel(store.name)}
          >
            {highlights.map((highlight: string) => (
              <span key={highlight} className={CUSTOMER_STORE_RESULT_LAYOUT.highlightChipClassName}>
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
        <div className={CUSTOMER_STORE_RESULT_LAYOUT.reviewClassName}>
          <p className={DELIVERY_UI.ticketKindClassName}>{CUSTOMER_STORE_RESULT_COPY.reviewSectionLabel}</p>
          <StoreReviewList
            emptyText={CUSTOMER_STORE_RESULT_COPY.reviewEmptyText}
            formatTime={formatTime}
            reviews={reviews}
            variant={STORE_REVIEW_LIST_VARIANT.compact}
          />
        </div>
        <p className={CUSTOMER_STORE_RESULT_LAYOUT.hintClassName}>
          {!isStoreLocated(locationStatus)
            ? getStoreBrowseHint(store, isStoreCurrentlyOpen, locationStatus)
            : !deliveryQuote.isDeliverable
            ? CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreHint
            : getStoreBrowseHint(store, isStoreCurrentlyOpen, locationStatus)}
        </p>
        <div className={DELIVERY_UI.actionRowClassName}>
          <button
            className={DELIVERY_UI.primaryButtonClassName}
            disabled={disabled}
            onClick={() => enterStore(store.id)}
            type={DELIVERY_UI.buttonType}
          >
            {getStoreBrowseButtonLabel(store, isStoreCurrentlyOpen, deliveryQuote.isDeliverable, locationStatus)}
          </button>
          <button
            className={DELIVERY_UI.secondaryButtonClassName}
            onClick={() => toggleFavoriteStore(store.id)}
            type={DELIVERY_UI.buttonType}
          >
            {isFavoriteStore
              ? CUSTOMER_STORE_RESULT_COPY.unfavoriteStoreButton
              : CUSTOMER_STORE_RESULT_COPY.favoriteStoreButton}
          </button>
          <button
            className={DELIVERY_UI.secondaryButtonClassName}
            onClick={() => toggleBlockedStore(store.id)}
            type={DELIVERY_UI.buttonType}
          >
            {CUSTOMER_STORE_RESULT_COPY.blockStoreButton}
          </button>
        </div>
      </div>
    </article>
  )
}
