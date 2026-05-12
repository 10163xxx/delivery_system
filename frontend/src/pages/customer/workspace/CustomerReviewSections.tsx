import { REVIEW_TARGET } from '@/shared/object/core/SharedObjects'
import {
  DEFAULT_REVIEW_RATING,
  LOW_RATING_MAX,
  MAX_RATING,
  MIN_RATING,
} from '@/shared/delivery/DeliveryServices'
import { StarRatingField } from '@/pages/review/StarRatingField'
import type {
  CustomerReviewOrderContentProps,
  CustomerReviewSectionProps,
} from '@/pages/customer/object/CustomerPageObjects'

function getReviewDraftKey(orderId: string, suffix: string) {
  return `${orderId}-${suffix}`
}

export function CustomerReviewSection({
  actionHint,
  buttonIdleLabel,
  buttonReadyLabel,
  emptyHint,
  extraNotePlaceholder,
  order,
  props,
  reasonOptions,
  reviewErrorKey,
  reviewTarget,
  subtitle,
  title,
}: CustomerReviewSectionProps) {
  const {
    hasPendingReview,
    reviewDrafts,
    reviewErrors,
    submitReview,
    updateReviewDraft,
  } = props
  const draftKey = getReviewDraftKey(order.id, reviewErrorKey)
  const errorText = reviewErrors[draftKey]
  const draft = reviewDrafts[draftKey]
  const isPending = hasPendingReview(order)

  return (
    <section className="review-rating-field">
      {errorText ? <div className="banner error review-inline-error">{errorText}</div> : null}
      <div className="review-rating-header">
        <span>{title}</span>
        <strong>{subtitle}</strong>
      </div>
      <StarRatingField
        label={title}
        rating={draft?.rating ?? DEFAULT_REVIEW_RATING}
        onChange={(rating) => updateReviewDraft(draftKey, { rating })}
      />
      <input
        className={errorText ? 'field-error' : undefined}
        placeholder={`非 ${MAX_RATING} 星时必须填写理由`}
        value={draft?.comment ?? ''}
        onChange={(event) => updateReviewDraft(draftKey, { comment: event.target.value })}
      />
      <div className="review-reason-options">
        {reasonOptions.map((reason) => (
          <button
            key={reason}
            className="secondary-button review-reason-chip"
            onClick={() => updateReviewDraft(draftKey, { comment: reason })}
            type="button"
          >
            {reason}
          </button>
        ))}
      </div>
      {errorText ? (
        <small className="field-error-text">{errorText}</small>
      ) : (
        <small className="field-hint">{emptyHint}</small>
      )}
      <input
        placeholder={extraNotePlaceholder}
        value={draft?.extraNote ?? ''}
        onChange={(event) => updateReviewDraft(draftKey, { extraNote: event.target.value })}
      />
      <div className="action-row">
        <p className="meta-line">{actionHint}</p>
        <button
          className="primary-button"
          disabled={!isPending}
          onClick={() => void submitReview(order.id, reviewTarget)}
          type="button"
        >
          {isPending ? buttonReadyLabel : buttonIdleLabel}
        </button>
      </div>
    </section>
  )
}

export function CustomerReviewOrderContent({ props }: CustomerReviewOrderContentProps) {
  const {
    activeReviewOrder,
    REVIEW_WINDOW_DAYS,
    STORE_REVIEW_REASON_OPTIONS,
    RIDER_REVIEW_REASON_OPTIONS,
    hasPendingRiderReview,
    hasPendingStoreReview,
    navigate,
  } = props

  if (!activeReviewOrder) return null

  return (
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
        <CustomerReviewSection
          actionHint={`${MAX_RATING} 星可直接提交，${MIN_RATING} 到 ${LOW_RATING_MAX} 星必须填写理由。`}
          buttonIdleLabel="商家已评价"
          buttonReadyLabel="提交商家评价"
          emptyHint="可以点击下方预设理由快速填写。"
          extraNotePlaceholder="商家补充说明（可选）"
          order={activeReviewOrder}
          props={{
            hasPendingReview: hasPendingStoreReview,
            reviewDrafts: props.reviewDrafts,
            reviewErrors: props.reviewErrors,
            submitReview: props.submitReview,
            updateReviewDraft: props.updateReviewDraft,
          }}
          reasonOptions={[...STORE_REVIEW_REASON_OPTIONS]}
          reviewErrorKey={REVIEW_TARGET.store}
          reviewTarget={REVIEW_TARGET.store}
          subtitle={
            activeReviewOrder.storeRating != null
              ? `已提交 ${activeReviewOrder.storeRating} 星`
              : '待提交'
          }
          title="商家评价"
        />
        {activeReviewOrder.riderId ? (
          <CustomerReviewSection
            actionHint="你不需要和商家评价一起提交，可以分开完成。"
            buttonIdleLabel="骑手已评价"
            buttonReadyLabel="提交骑手评价"
            emptyHint="可以先选预设理由，再补充自己的描述。"
            extraNotePlaceholder="骑手补充说明（可选）"
            order={activeReviewOrder}
            props={{
              hasPendingReview: hasPendingRiderReview,
              reviewDrafts: props.reviewDrafts,
              reviewErrors: props.reviewErrors,
              submitReview: props.submitReview,
              updateReviewDraft: props.updateReviewDraft,
            }}
            reasonOptions={[...RIDER_REVIEW_REASON_OPTIONS]}
            reviewErrorKey={REVIEW_TARGET.rider}
            reviewTarget={REVIEW_TARGET.rider}
            subtitle={
              activeReviewOrder.riderRating != null
                ? `已提交 ${activeReviewOrder.riderRating} 星`
                : '待提交'
            }
            title="骑手评价"
          />
        ) : null}
        <div className="action-row">
          <button className="secondary-button" onClick={() => navigate('/customer/orders')} type="button">
            返回订单
          </button>
        </div>
      </div>
      <p className="meta-line">评价入口仅保留到订单完成后 {REVIEW_WINDOW_DAYS} 天内。</p>
    </section>
  )
}
