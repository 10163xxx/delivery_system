// Search bar, search history, and frequent-store sections for the customer catalog.
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { DisplayText } from '@/objects/core/SharedObjects'
export { SearchHistoryPanel } from '@/pages/CustomerConsole/components/store/SearchHistoryPanel'
import { CUSTOMER_STORE_VISIBILITY } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import {
  CUSTOMER_STORE_RESULT_COPY,
  CUSTOMER_STORE_RESULT_LAYOUT,
  CUSTOMER_STORE_BROWSE_COPY,
  CUSTOMER_STORE_BROWSE_LAYOUT,
  DELIVERY_UI,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import {
  CUSTOMER_STORE_SORT_MODE,
  CUSTOMER_STORE_TOP_ITEM_SEPARATOR,
  EMPTY_TEXT,
  FIRST_ITEM_INDEX,
  KEYBOARD_ENTER_KEY,
  ZERO_COUNT,
  parseCustomerStoreSortMode,
  type CustomerStoreSortMode,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function StoreSearchBar({
  props,
  storeSortMode,
  setStoreSortMode,
}: {
  props: CustomerRoleProps
  storeSortMode: CustomerStoreSortMode
  setStoreSortMode: (mode: CustomerStoreSortMode) => void
}) {
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
    <div className={DELIVERY_UI.summaryBarClassName}>
      <label style={{ flex: 1, minWidth: CUSTOMER_STORE_BROWSE_LAYOUT.searchInputMinWidth }}>
        <span>{CUSTOMER_STORE_BROWSE_COPY.searchInputLabel}</span>
        <input
          placeholder={CUSTOMER_STORE_BROWSE_COPY.searchInputPlaceholder}
          value={customerStoreSearchDraft}
          onChange={(event) => setCustomerStoreSearchDraft(asDomainText<DisplayText>(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === KEYBOARD_ENTER_KEY) {
              event.preventDefault()
              submitCustomerStoreSearch()
            }
          }}
        />
      </label>
      <button className={DELIVERY_UI.primaryButtonClassName} onClick={() => submitCustomerStoreSearch()} type={DELIVERY_UI.buttonType}>
        {CUSTOMER_STORE_BROWSE_COPY.searchButton}
      </button>
      {customerStoreSearchDraft.trim() || customerStoreSearch.trim() ? (
        <button
          className={DELIVERY_UI.secondaryButtonClassName}
          onClick={() => {
            setCustomerStoreSearchDraft(asDomainText<DisplayText>(EMPTY_TEXT))
            setCustomerStoreSearch(asDomainText<DisplayText>(EMPTY_TEXT))
          }}
          type={DELIVERY_UI.buttonType}
        >
          {CUSTOMER_STORE_BROWSE_COPY.searchClearButton}
        </button>
      ) : null}
      <button
        className={showOrderableOnly ? DELIVERY_UI.primaryButtonClassName : DELIVERY_UI.secondaryButtonClassName}
        onClick={() =>
          setCustomerStoreVisibility((current) =>
            current === CUSTOMER_STORE_VISIBILITY.orderableOnly
              ? CUSTOMER_STORE_VISIBILITY.all
              : CUSTOMER_STORE_VISIBILITY.orderableOnly,
          )
        }
        type={DELIVERY_UI.buttonType}
      >
        {showOrderableOnly
          ? CUSTOMER_STORE_BROWSE_COPY.showOrderableOnlyButton
          : CUSTOMER_STORE_BROWSE_COPY.showAllStoresButton}
      </button>
      <label>
        <span>{CUSTOMER_STORE_BROWSE_COPY.sortSelectLabel}</span>
        <select
          value={storeSortMode}
          onChange={(event) => setStoreSortMode(parseCustomerStoreSortMode(event.target.value))}
        >
          <option value={CUSTOMER_STORE_SORT_MODE.distance}>
            {CUSTOMER_STORE_BROWSE_COPY.sortByDistanceOption}
          </option>
          <option value={CUSTOMER_STORE_SORT_MODE.rating}>
            {CUSTOMER_STORE_BROWSE_COPY.sortByRatingOption}
          </option>
        </select>
      </label>
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
  const featuredFrequentStore = visibleFrequentStores[FIRST_ITEM_INDEX] ?? null

  if (!featuredFrequentStore) return null

  return (
    <section className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentSectionClassName}>
      <div className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentStripClassName}>
        <div className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentHeadingClassName}>
          <p className={DELIVERY_UI.ticketKindClassName}>{CUSTOMER_STORE_BROWSE_COPY.recentFrequentCardTitle}</p>
          <h3>{featuredFrequentStore.storeName}</h3>
        </div>
        <span className={CUSTOMER_STORE_RESULT_LAYOUT.successBadgeClassName}>
          {`${featuredFrequentStore.orderCount}${CUSTOMER_STORE_BROWSE_COPY.recentFrequentCountSuffix}`}
        </span>
        <p className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentMetaClassName}>
          {`${featuredFrequentStore.category} · ${CUSTOMER_STORE_BROWSE_COPY.recentFrequentLastOrderedLabel} ${formatTime(featuredFrequentStore.lastOrderedAt)} · ${
            featuredFrequentStore.topItems.length > ZERO_COUNT
              ? `${CUSTOMER_STORE_BROWSE_COPY.recentFrequentTopItemsPrefix}${featuredFrequentStore.topItems.join(CUSTOMER_STORE_TOP_ITEM_SEPARATOR)}`
              : CUSTOMER_STORE_BROWSE_COPY.recentFrequentEmptyHint
          }`}
        </p>
        <div className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentActionsClassName}>
          <button
            className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentPrimaryButtonClassName}
            onClick={() => addPreviousOrderToCart(featuredFrequentStore.latestOrder)}
            type={DELIVERY_UI.buttonType}
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentAddToCartButton}
          </button>
          <button
            className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentButtonClassName}
            onClick={() => repeatOrder(featuredFrequentStore.latestOrder)}
            type={DELIVERY_UI.buttonType}
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentRepeatOrderButton}
          </button>
          <button
            className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentButtonClassName}
            onClick={() => enterStore(featuredFrequentStore.storeId)}
            disabled={!featuredFrequentStore.canOrder}
            type={DELIVERY_UI.buttonType}
          >
            {CUSTOMER_STORE_BROWSE_COPY.recentFrequentEnterStoreButton}
          </button>
          <button
            className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentButtonClassName}
            onClick={() => toggleFavoriteStore(featuredFrequentStore.storeId)}
            type={DELIVERY_UI.buttonType}
          >
            {favoriteStoreIds.includes(featuredFrequentStore.storeId)
              ? CUSTOMER_STORE_RESULT_COPY.unfavoriteStoreButton
              : CUSTOMER_STORE_RESULT_COPY.favoriteStoreButton}
          </button>
          <button
            className={CUSTOMER_STORE_BROWSE_LAYOUT.recentFrequentButtonClassName}
            onClick={() => toggleBlockedStore(featuredFrequentStore.storeId)}
            type={DELIVERY_UI.buttonType}
          >
            {CUSTOMER_STORE_RESULT_COPY.blockStoreButton}
          </button>
        </div>
      </div>
    </section>
  )
}
