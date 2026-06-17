import { DisplayImageSlot } from '@/pages/DeliveryConsole/components/primitives/DisplayImageSlot'
import type { CustomerStoreBrowseResultCardProps } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import {
  CUSTOMER_STORE_RESULT_LAYOUT,
  CUSTOMER_STORE_RESULT_COPY,
  formatStoreImageAlt,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { getStoreDeliveryQuote } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import { useStoreLocationStatus } from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'
import {
  getResolvedStoreBrowseHint,
  isStoreBrowseDisabled,
} from '@/pages/CustomerConsole/functions/store/CustomerStoreBrowseState'
import {
  StoreResultActions,
  StoreResultHeader,
  StoreResultHighlights,
  StoreResultMetrics,
  StoreResultReviewPreview,
} from '@/pages/CustomerConsole/components/store/StoreResultCardParts'

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
