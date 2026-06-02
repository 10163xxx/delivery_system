import type { Dispatch, SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab, type StoreCustomerReview } from '@/objects/customer/page/CustomerPageObjects'
import {
  SelectedStoreReviewSection,
  SelectedStoreTabs,
  SelectedStoreToolbar,
} from '@/pages/customer/store/CustomerSelectedStoreSections'
import { CustomerStatusBar } from '@/pages/customer/store/CustomerHomeStatusBar'
import { CustomerCheckoutBody } from '@/pages/customer/checkout/CustomerCheckoutBody'
import { SELECTED_STORE_COPY } from '@/features/delivery/DeliveryMessages'
import {
  isStoreLocated,
  useStoreLocationStatus,
} from '@/features/delivery/DeliveryStoreLocation'

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
  if (reviews.length === 0) {
    return <p className="meta-line store-review-empty">{emptyText}</p>
  }

  return (
    <div className={`store-review-list ${variant === STORE_REVIEW_LIST_VARIANT.compact ? 'is-compact' : ''}`}>
      {reviews.map((review) => (
        <article key={review.id} className="store-review-item">
          <div className="store-review-header">
            <strong>{review.customerName}</strong>
            <span>{review.rating} 星</span>
          </div>
          <p>{review.comment ?? SELECTED_STORE_COPY.reviewCommentFallback}</p>
          {review.extraNote ? (
            <p className="meta-line">
              {SELECTED_STORE_COPY.reviewExtraNotePrefix}
              {review.extraNote}
            </p>
          ) : null}
          {review.merchantReply ? (
            <div className="banner info">
              <strong>{SELECTED_STORE_COPY.reviewMerchantReplyTitle}</strong>
              <p>{review.merchantReply}</p>
              {review.merchantReplyAt ? (
                <p className="meta-line">
                  {SELECTED_STORE_COPY.reviewReplyTimePrefix}
                  {formatTime(review.merchantReplyAt)}
                </p>
              ) : null}
            </div>
          ) : null}
          {variant === STORE_REVIEW_LIST_VARIANT.full ? (
            <p className="meta-line">
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
        <div className="banner warning">
          {SELECTED_STORE_COPY.closedBanner(formatBusinessHours(selectedStore.businessHours))}
        </div>
      ) : null}
      {!storeLocated ? (
        <div className="banner warning">
          店铺地址未定位，暂不可营业。
        </div>
      ) : null}

      <section className="store-detail-panel">
        <SelectedStoreTabs selectedStoreName={selectedStore.name} selectedStoreTab={selectedStoreTab} setSelectedStoreTab={setSelectedStoreTab} />

        {selectedStoreTab === CUSTOMER_STORE_TAB.menu ? (
          <>
            <div className="store-detail-summary">
              <p className="ticket-kind">{SELECTED_STORE_COPY.menuTicketKind}</p>
              <h3>{selectedStore.name}</h3>
              <p className="meta-line">{SELECTED_STORE_COPY.menuTabHint}</p>
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
