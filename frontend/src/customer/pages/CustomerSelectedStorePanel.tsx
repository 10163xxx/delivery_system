import type { CustomerRoleProps } from '@/shared/AppBuildRoleProps'

type StoreCustomerReview = CustomerRoleProps['storeCustomerReviews'][string][number]

export function StoreReviewList({
  emptyText,
  formatTime,
  reviews,
  variant = 'full',
}: {
  emptyText: string
  formatTime: CustomerRoleProps['formatTime']
  reviews: StoreCustomerReview[]
  variant?: 'compact' | 'full'
}) {
  if (reviews.length === 0) {
    return <p className="meta-line store-review-empty">{emptyText}</p>
  }

  return (
    <div className={`store-review-list ${variant === 'compact' ? 'is-compact' : ''}`}>
      {reviews.map((review) => (
        <article key={review.id} className="store-review-item">
          <div className="store-review-header">
            <strong>{review.customerName}</strong>
            <span>{review.rating} 星</span>
          </div>
          <p>{review.comment ?? '顾客没有填写文字评价。'}</p>
          {review.extraNote ? <p className="meta-line">补充：{review.extraNote}</p> : null}
          {variant === 'full' ? (
            <p className="meta-line">订单完成于 {formatTime(review.completedAt)}</p>
          ) : null}
        </article>
      ))}
    </div>
  )
}

export function SelectedStoreBanner({
  props,
}: {
  props: CustomerRoleProps
}) {
  const {
    selectedStore,
    formatStoreAvailability,
    formatBusinessHours,
    formatAggregateRating,
    formatTime,
    leaveStore,
    resetStoreCategory,
    isStoreCurrentlyOpen,
    quantities,
    storeCustomerReviews,
  } = props

  if (!selectedStore) return null
  const reviews = storeCustomerReviews[selectedStore.id] ?? []

  return (
    <>
      <div className="store-toolbar">
        <div>
          <p className="ticket-kind">当前店铺</p>
          <strong>{selectedStore.name}</strong>
          <p className="meta-line">
            {selectedStore.category} · {selectedStore.merchantName} ·{' '}
            {formatStoreAvailability(selectedStore)}
          </p>
          <p className="meta-line">营业时间 {formatBusinessHours(selectedStore.businessHours)}</p>
        </div>
        <div>
          <p>店铺评分</p>
          <strong>
            {formatAggregateRating(selectedStore.averageRating, selectedStore.ratingCount)}
          </strong>
        </div>
        <div>
          <p>已选菜品</p>
          <strong>
            {selectedStore.menu.reduce((sum, item) => sum + (quantities[item.id] ?? 0), 0)}
          </strong>
        </div>
        <button
          className="secondary-button store-back-button"
          onClick={() => leaveStore()}
          style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }}
          type="button"
        >
          返回当前分类
        </button>
        <button
          className="primary-button store-reset-button"
          onClick={() => resetStoreCategory()}
          style={{ minWidth: '220px', minHeight: '64px', fontSize: '1.1rem' }}
          type="button"
        >
          重新选择分类
        </button>
      </div>

      {!isStoreCurrentlyOpen(selectedStore) ? (
        <div className="banner warning">
          当前不在营业时间内，店铺营业时间为 {formatBusinessHours(selectedStore.businessHours)}。
        </div>
      ) : null}

      <section className="store-review-panel">
        <div className="panel-header">
          <div>
            <p className="ticket-kind">商家评价</p>
            <h3>{selectedStore.name}</h3>
            <p className="meta-line">来自已完成订单的顾客评价。</p>
          </div>
          <span className="badge">{reviews.length} 条</span>
        </div>
        <StoreReviewList
          emptyText="当前还没有顾客评价。"
          formatTime={formatTime}
          reviews={reviews}
        />
      </section>
    </>
  )
}
