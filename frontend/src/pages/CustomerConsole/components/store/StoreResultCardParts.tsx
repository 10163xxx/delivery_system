import { StoreReviewList } from '@/pages/CustomerConsole/components/store/CustomerSelectedStorePanel'
import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import {
  CUSTOMER_STORE_RESULT_COPY,
  CUSTOMER_STORE_RESULT_LAYOUT,
  DELIVERY_UI,
  formatStoreHighlightListAriaLabel,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import type { StoreLocationStatus } from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'
import { getStoreBrowseButtonLabel } from '@/pages/CustomerConsole/functions/store/CustomerStoreBrowseState'

export function StoreResultHeader({
  formatStoreAvailability,
  store,
}: Pick<CustomerStoreBrowseResultCardProps['props'], 'formatStoreAvailability'> & {
  store: Store
}) {
  const badgeClassName =
    store.status === STORE_STATUS.revoked
      ? CUSTOMER_STORE_RESULT_LAYOUT.warningBadgeClassName
      : CUSTOMER_STORE_RESULT_LAYOUT.successBadgeClassName

  return (
    <div className={DELIVERY_UI.ticketHeaderClassName}>
      <div>
        <p className={DELIVERY_UI.ticketKindClassName}>{store.category}</p>
        <h3>{store.name}</h3>
      </div>
      <span className={badgeClassName}>{formatStoreAvailability(store)}</span>
    </div>
  )
}

export function StoreResultMetrics({
  deliveryQuote,
  formatAggregateRating,
  formatPrice,
  monthlyOrdersByStore,
  store,
}: Pick<
  CustomerStoreBrowseResultCardProps['props'],
  'formatAggregateRating' | 'formatPrice' | 'monthlyOrdersByStore'
> & {
  deliveryQuote: ReturnType<typeof getStoreDeliveryQuote>
  store: Store
}) {
  const metrics = [
    {
      label: CUSTOMER_STORE_RESULT_COPY.storeRatingLabel,
      value: formatAggregateRating(store.averageRating, store.ratingCount),
    },
    {
      label: CUSTOMER_STORE_RESULT_COPY.menuCountLabel,
      value: `${store.menu.length}${CUSTOMER_STORE_RESULT_COPY.menuCountSuffix}`,
    },
    {
      label: CUSTOMER_STORE_RESULT_COPY.recentMonthOrderLabel,
      value: `${monthlyOrdersByStore[store.id] ?? ZERO_COUNT}${CUSTOMER_STORE_RESULT_COPY.recentMonthOrderSuffix}`,
    },
    {
      label: CUSTOMER_STORE_RESULT_COPY.prepSpeedLabel,
      value: `${store.avgPrepMinutes}${CUSTOMER_STORE_RESULT_COPY.prepSpeedSuffix}`,
    },
    {
      label: CUSTOMER_STORE_RESULT_COPY.deliveryDistanceLabel,
      value: deliveryQuote.distanceLabel,
    },
    {
      label: CUSTOMER_STORE_RESULT_COPY.deliveryFeeLabel,
      value: formatPrice(deliveryQuote.deliveryFeeCents),
    },
  ]

  return (
    <div className={CUSTOMER_STORE_RESULT_LAYOUT.summaryClassName}>
      {metrics.map((metric) => (
        <div key={metric.label}>
          <p>{metric.label}</p>
          <strong>{metric.value}</strong>
        </div>
      ))}
    </div>
  )
}

export function StoreResultHighlights({ highlights, store }: { highlights: string[]; store: Store }) {
  if (highlights.length === ZERO_COUNT) return null

  return (
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
  )
}

export function StoreResultReviewPreview({
  formatTime,
  reviews,
}: Pick<CustomerStoreBrowseResultCardProps['props'], 'formatTime'> & {
  reviews: CustomerStoreBrowseResultCardProps['reviews']
}) {
  return (
    <div className={CUSTOMER_STORE_RESULT_LAYOUT.reviewClassName}>
      <p className={DELIVERY_UI.ticketKindClassName}>
        {CUSTOMER_STORE_RESULT_COPY.reviewSectionLabel}
      </p>
      <StoreReviewList
        emptyText={CUSTOMER_STORE_RESULT_COPY.reviewEmptyText}
        formatTime={formatTime}
        reviews={reviews}
        variant="compact"
      />
    </div>
  )
}

export function StoreResultActions({
  disabled,
  enterStore,
  isFavoriteStore,
  isStoreCurrentlyOpen,
  locationStatus,
  store,
  toggleBlockedStore,
  toggleFavoriteStore,
  isDeliverable,
}: Pick<
  CustomerStoreBrowseResultCardProps['props'],
  'enterStore' | 'isStoreCurrentlyOpen' | 'toggleBlockedStore' | 'toggleFavoriteStore'
> & {
  disabled: boolean
  isDeliverable: boolean
  isFavoriteStore: boolean
  locationStatus: StoreLocationStatus
  store: Store
}) {
  return (
    <div className={DELIVERY_UI.actionRowClassName}>
      <button
        className={DELIVERY_UI.primaryButtonClassName}
        disabled={disabled}
        onClick={() => enterStore(store.id)}
        type={DELIVERY_UI.buttonType}
      >
        {getStoreBrowseButtonLabel(store, isStoreCurrentlyOpen, isDeliverable, locationStatus)}
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
  )
}
