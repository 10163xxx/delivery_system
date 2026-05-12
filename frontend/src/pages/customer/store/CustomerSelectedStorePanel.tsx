import type { Dispatch, SetStateAction } from 'react'
import type { CustomerRoleProps } from '@/shared/app/role-props'
import { CUSTOMER_STORE_TAB, type CustomerStoreTab, type StoreCustomerReview } from '@/pages/customer/object/CustomerPageObjects'
import {
  SelectedStoreReviewSection,
  SelectedStoreTabs,
  SelectedStoreToolbar,
} from '@/pages/customer/store/CustomerSelectedStoreSections'

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
          <p>{review.comment ?? '顾客没有填写文字评价。'}</p>
          {review.extraNote ? <p className="meta-line">补充：{review.extraNote}</p> : null}
          {variant === STORE_REVIEW_LIST_VARIANT.full ? (
            <p className="meta-line">订单完成于 {formatTime(review.completedAt)}</p>
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

  if (!selectedStore) return null

  return (
    <>
      <SelectedStoreToolbar props={props} />

      {!isStoreCurrentlyOpen(selectedStore) ? (
        <div className="banner warning">
          当前不在营业时间内，店铺营业时间为 {formatBusinessHours(selectedStore.businessHours)}。
        </div>
      ) : null}

      <section className="store-detail-panel">
        <SelectedStoreTabs selectedStoreName={selectedStore.name} selectedStoreTab={selectedStoreTab} setSelectedStoreTab={setSelectedStoreTab} />

        {selectedStoreTab === CUSTOMER_STORE_TAB.menu ? (
          <div className="store-detail-summary">
            <p className="ticket-kind">店内点餐</p>
            <h3>{selectedStore.name}</h3>
            <p className="meta-line">切换到“评价”即可查看这家店铺的全部顾客评价。</p>
          </div>
        ) : (
          <SelectedStoreReviewSection props={props} />
        )}
      </section>
    </>
  )
}
