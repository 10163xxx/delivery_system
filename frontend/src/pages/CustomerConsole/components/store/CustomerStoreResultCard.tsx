import { StoreReviewList } from '@/pages/CustomerConsole/components/store/CustomerSelectedStorePanel'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { DisplayImageSlot } from '@/pages/DeliveryConsole/components/primitives/DisplayImageSlot'
import { STORE_STATUS, type Store } from '@/objects/core/SharedObjects'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import {
  CUSTOMER_STORE_RESULT_LAYOUT,
  CUSTOMER_STORE_RESULT_COPY,
  formatStoreHighlightListAriaLabel,
  formatStoreImageAlt,
  DELIVERY_UI,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import {
  isStoreLocated,
  type StoreLocationStatus,
  useStoreLocationStatus,
} from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'

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

function isStoreBrowseDisabled(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  return (
    !isStoreLocated(locationStatus) ||
    store.status === STORE_STATUS.revoked ||
    !isStoreCurrentlyOpen(store) ||
    store.menu.length === ZERO_COUNT ||
    !isDeliverable
  )
}

function getResolvedStoreBrowseHint(
  store: Store,
  isStoreCurrentlyOpen: CustomerRoleProps['isStoreCurrentlyOpen'],
  isDeliverable: boolean,
  locationStatus: StoreLocationStatus,
) {
  if (isStoreLocated(locationStatus) && !isDeliverable) {
    return CUSTOMER_STORE_RESULT_COPY.outOfRangeStoreHint
  }
  return getStoreBrowseHint(store, isStoreCurrentlyOpen, locationStatus)
}

function StoreResultHeader({
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

function StoreResultMetrics({
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

function StoreResultHighlights({ highlights, store }: { highlights: string[]; store: Store }) {
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

function StoreResultReviewPreview({
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

function StoreResultActions({
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
  const disabled = isStoreBrowseDisabled(
    store,
    isStoreCurrentlyOpen,
    deliveryQuote.isDeliverable,
    locationStatus,
  )
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
        <StoreResultHeader formatStoreAvailability={formatStoreAvailability} store={store} />
        <StoreResultMetrics
          deliveryQuote={deliveryQuote}
          formatAggregateRating={formatAggregateRating}
          formatPrice={formatPrice}
          monthlyOrdersByStore={monthlyOrdersByStore}
          store={store}
        />
        <StoreResultHighlights highlights={highlights} store={store} />
        <StoreResultReviewPreview formatTime={formatTime} reviews={reviews} />
        <p className={CUSTOMER_STORE_RESULT_LAYOUT.hintClassName}>
          {getResolvedStoreBrowseHint(
            store,
            isStoreCurrentlyOpen,
            deliveryQuote.isDeliverable,
            locationStatus,
          )}
        </p>
        <StoreResultActions
          disabled={disabled}
          enterStore={enterStore}
          isDeliverable={deliveryQuote.isDeliverable}
          isFavoriteStore={isFavoriteStore}
          isStoreCurrentlyOpen={isStoreCurrentlyOpen}
          locationStatus={locationStatus}
          store={store}
          toggleBlockedStore={toggleBlockedStore}
          toggleFavoriteStore={toggleFavoriteStore}
        />
      </div>
    </article>
  )
}
