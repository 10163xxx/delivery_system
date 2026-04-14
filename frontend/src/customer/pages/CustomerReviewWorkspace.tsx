import type { CustomerRoleProps } from '@/shared/app-build-role-props'
import { REVIEW_TARGET } from '@/shared/object'
import { DEFAULT_REVIEW_RATING, LOW_RATING_MAX, MAX_RATING, MIN_RATING } from '@/shared/delivery'
import { Panel } from '@/shared/components/LayoutPrimitives'
import { StarRatingField } from '@/review/pages/StarRatingField'

export function CustomerReviewWorkspace(props: CustomerRoleProps) {
  const {
    activeReviewOrder,
    REVIEW_WINDOW_DAYS,
    reviewErrors,
    reviewDrafts,
    updateReviewDraft,
    STORE_REVIEW_REASON_OPTIONS,
    RIDER_REVIEW_REASON_OPTIONS,
    hasPendingStoreReview,
    hasPendingRiderReview,
    submitReview,
    navigate,
  } = props

  return (
    <Panel title="订单评价" description={`商家与骑手评价现在分开提交。${MAX_RATING} 星可直接提交，非 ${MAX_RATING} 星必须填写理由；评价入口仅保留到订单完成后 ${REVIEW_WINDOW_DAYS} 天内。`}>
      {activeReviewOrder ? (
        <section className="review-page-panel">
          <div className="panel-header">
            <div>
              <h3>{activeReviewOrder.storeName}</h3>
              <p>
                {activeReviewOrder.id} · {activeReviewOrder.riderName ?? '待分配骑手'}
              </p>
            </div>
          </div>
          <div className="review-dialog-form">
            <section className="review-rating-field">
              {reviewErrors[`${activeReviewOrder.id}-store`] ? <div className="banner error review-inline-error">{reviewErrors[`${activeReviewOrder.id}-store`]}</div> : null}
              <div className="review-rating-header">
                <span>商家评价</span>
                <strong>{activeReviewOrder.storeRating != null ? `已提交 ${activeReviewOrder.storeRating} 星` : '待提交'}</strong>
              </div>
              <StarRatingField
                label="商家评分"
                rating={reviewDrafts[`${activeReviewOrder.id}-store`]?.rating ?? DEFAULT_REVIEW_RATING}
                onChange={(rating) => updateReviewDraft(`${activeReviewOrder.id}-store`, { rating })}
              />
              <input
                className={reviewErrors[`${activeReviewOrder.id}-store`] ? 'field-error' : undefined}
                placeholder={`非 ${MAX_RATING} 星时必须填写理由`}
                value={reviewDrafts[`${activeReviewOrder.id}-store`]?.comment ?? ''}
                onChange={(event) => updateReviewDraft(`${activeReviewOrder.id}-store`, { comment: event.target.value })}
              />
              <div className="review-reason-options">
                {STORE_REVIEW_REASON_OPTIONS.map((reason) => (
                  <button key={reason} className="secondary-button review-reason-chip" onClick={() => updateReviewDraft(`${activeReviewOrder.id}-store`, { comment: reason })} type="button">
                    {reason}
                  </button>
                ))}
              </div>
              {reviewErrors[`${activeReviewOrder.id}-store`] ? <small className="field-error-text">{reviewErrors[`${activeReviewOrder.id}-store`]}</small> : <small className="field-hint">可以点击下方预设理由快速填写。</small>}
              <input
                placeholder="商家补充说明（可选）"
                value={reviewDrafts[`${activeReviewOrder.id}-store`]?.extraNote ?? ''}
                onChange={(event) => updateReviewDraft(`${activeReviewOrder.id}-store`, { extraNote: event.target.value })}
              />
              <div className="action-row">
                <p className="meta-line">{MAX_RATING} 星可直接提交，{MIN_RATING} 到 {LOW_RATING_MAX} 星必须填写理由。</p>
                <button className="primary-button" disabled={!hasPendingStoreReview(activeReviewOrder)} onClick={() => void submitReview(activeReviewOrder.id, REVIEW_TARGET.store)} type="button">
                  {hasPendingStoreReview(activeReviewOrder) ? '提交商家评价' : '商家已评价'}
                </button>
              </div>
            </section>
            {activeReviewOrder.riderId ? (
              <section className="review-rating-field">
                {reviewErrors[`${activeReviewOrder.id}-rider`] ? <div className="banner error review-inline-error">{reviewErrors[`${activeReviewOrder.id}-rider`]}</div> : null}
                <div className="review-rating-header">
                  <span>骑手评价</span>
                  <strong>{activeReviewOrder.riderRating != null ? `已提交 ${activeReviewOrder.riderRating} 星` : '待提交'}</strong>
                </div>
                <StarRatingField
                  label="骑手评分"
                  rating={reviewDrafts[`${activeReviewOrder.id}-rider`]?.rating ?? DEFAULT_REVIEW_RATING}
                  onChange={(rating) => updateReviewDraft(`${activeReviewOrder.id}-rider`, { rating })}
                />
                <input
                  className={reviewErrors[`${activeReviewOrder.id}-rider`] ? 'field-error' : undefined}
                  placeholder={`非 ${MAX_RATING} 星时必须填写理由`}
                  value={reviewDrafts[`${activeReviewOrder.id}-rider`]?.comment ?? ''}
                  onChange={(event) => updateReviewDraft(`${activeReviewOrder.id}-rider`, { comment: event.target.value })}
                />
                <div className="review-reason-options">
                  {RIDER_REVIEW_REASON_OPTIONS.map((reason) => (
                    <button key={reason} className="secondary-button review-reason-chip" onClick={() => updateReviewDraft(`${activeReviewOrder.id}-rider`, { comment: reason })} type="button">
                      {reason}
                    </button>
                  ))}
                </div>
                {reviewErrors[`${activeReviewOrder.id}-rider`] ? <small className="field-error-text">{reviewErrors[`${activeReviewOrder.id}-rider`]}</small> : <small className="field-hint">可以先选预设理由，再补充自己的描述。</small>}
                <input
                  placeholder="骑手补充说明（可选）"
                  value={reviewDrafts[`${activeReviewOrder.id}-rider`]?.extraNote ?? ''}
                  onChange={(event) => updateReviewDraft(`${activeReviewOrder.id}-rider`, { extraNote: event.target.value })}
                />
                <div className="action-row">
                  <p className="meta-line">你不需要和商家评价一起提交，可以分开完成。</p>
                  <button className="primary-button" disabled={!hasPendingRiderReview(activeReviewOrder)} onClick={() => void submitReview(activeReviewOrder.id, REVIEW_TARGET.rider)} type="button">
                    {hasPendingRiderReview(activeReviewOrder) ? '提交骑手评价' : '骑手已评价'}
                  </button>
                </div>
              </section>
            ) : null}
            <div className="action-row">
              <button className="secondary-button" onClick={() => navigate('/customer/orders')} type="button">
                返回订单
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </Panel>
  )
}
