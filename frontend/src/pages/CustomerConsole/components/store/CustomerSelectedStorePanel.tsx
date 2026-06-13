import type { Dispatch, SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab, type StoreCustomerReview } from '@/pages/CustomerConsole/objects/CustomerStoreObjects'
import {
  SelectedStoreReviewSection,
  SelectedStoreTabs,
  SelectedStoreToolbar,
} from '@/pages/CustomerConsole/components/store/CustomerSelectedStoreSections'
import { CustomerStatusBar } from '@/pages/CustomerConsole/components/store/CustomerHomeStatusBar'
import { CustomerCheckoutBody } from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutBody'
import {
  DELIVERY_UI,
  SELECTED_STORE_COPY,
  SELECTED_STORE_LAYOUT,
  formatSelectedStoreClosedBanner,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import {
  isStoreLocated,
  useStoreLocationStatus,
} from '@/pages/DeliveryConsole/functions/map/DeliveryStoreLocation'
import { ZERO_COUNT } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'

export function StoreReviewList({
  emptyText,
  formatTime,
  reviews,
  variant = STORE_REVIEW_LIST_VARIANT.full,
}: {
  emptyText: string
  formatTime: CustomerRoleProps['formatTime']
  reviews: StoreCustomerReview[]
  variant?: StoreReviewListVariant
}) {
  if (reviews.length === ZERO_COUNT) {
    return <p className={SELECTED_STORE_LAYOUT.reviewEmptyClassName}>{emptyText}</p>
  }
  const reviewListClassName =
    variant === STORE_REVIEW_LIST_VARIANT.compact
      ? SELECTED_STORE_LAYOUT.compactReviewListClassName
      : SELECTED_STORE_LAYOUT.reviewListClassName

  return (
    <div className={reviewListClassName}>
      {reviews.map((review) => (
        <article key={review.id} className={SELECTED_STORE_LAYOUT.reviewItemClassName}>
          <div className={SELECTED_STORE_LAYOUT.reviewHeaderClassName}>
            <strong>{review.customerName}</strong>
            <span>{review.rating} 星</span>
          </div>
          <p>{review.comment ?? SELECTED_STORE_COPY.reviewCommentFallback}</p>
          {review.extraNote ? (
            <p className={DELIVERY_UI.metaLineClassName}>
              {SELECTED_STORE_COPY.reviewExtraNotePrefix}
              {review.extraNote}
            </p>
          ) : null}
          {review.merchantReply ? (
            <div className={DELIVERY_UI.bannerInfoClassName}>
              <strong>{SELECTED_STORE_COPY.reviewMerchantReplyTitle}</strong>
              <p>{review.merchantReply}</p>
              {review.merchantReplyAt ? (
                <p className={DELIVERY_UI.metaLineClassName}>
                  {SELECTED_STORE_COPY.reviewReplyTimePrefix}
                  {formatTime(review.merchantReplyAt)}
                </p>
              ) : null}
            </div>
          ) : null}
          {variant === STORE_REVIEW_LIST_VARIANT.full ? (
            <p className={DELIVERY_UI.metaLineClassName}>
              {SELECTED_STORE_COPY.reviewCompletedAtPrefix}
              {formatTime(review.completedAt)}
            </p>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export const STORE_REVIEW_LIST_VARIANT = {
  compact: 'compact',
  full: 'full',
} as const

export type StoreReviewListVariant =
  (typeof STORE_REVIEW_LIST_VARIANT)[keyof typeof STORE_REVIEW_LIST_VARIANT]

export function SelectedStoreBanner({
  props,
  selectedStoreTab,
  setSelectedStoreTab,
}: {
  props: CustomerRoleProps
  selectedStoreTab: CustomerStoreTab
  setSelectedStoreTab: Dispatch<SetStateAction<CustomerStoreTab>>
}) {
  const {
    selectedStore,
    formatBusinessHours,
    isStoreCurrentlyOpen,
  } = props

  const storeLocationStatus = useStoreLocationStatus(selectedStore)
  const storeLocated = isStoreLocated(storeLocationStatus)
  if (!selectedStore) return null

  return (
    <>
      <CustomerStatusBar props={props} />
      <SelectedStoreToolbar props={props} />

      {!isStoreCurrentlyOpen(selectedStore) ? (
        <div className={DELIVERY_UI.bannerWarningClassName}>
          {formatSelectedStoreClosedBanner(formatBusinessHours(selectedStore.businessHours))}
        </div>
      ) : null}
      {!storeLocated ? (
        <div className={DELIVERY_UI.bannerWarningClassName}>
          {SELECTED_STORE_COPY.locationUnavailableBanner}
        </div>
      ) : null}

      <section className={SELECTED_STORE_LAYOUT.detailPanelClassName}>
        <SelectedStoreTabs selectedStoreName={selectedStore.name} selectedStoreTab={selectedStoreTab} setSelectedStoreTab={setSelectedStoreTab} />

        {selectedStoreTab === CUSTOMER_STORE_TAB.menu ? (
          <>
            <div className={SELECTED_STORE_LAYOUT.detailSummaryClassName}>
              <p className={DELIVERY_UI.ticketKindClassName}>{SELECTED_STORE_COPY.menuTicketKind}</p>
              <h3>{selectedStore.name}</h3>
              <p className={DELIVERY_UI.metaLineClassName}>{SELECTED_STORE_COPY.menuTabHint}</p>
            </div>
            {storeLocated ? <CustomerCheckoutBody {...props} /> : null}
          </>
        ) : (
          <SelectedStoreReviewSection props={props} />
        )}
      </section>
    </>
  )
}
