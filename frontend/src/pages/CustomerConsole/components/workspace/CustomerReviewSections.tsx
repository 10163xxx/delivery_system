import { ROUTE_PATH, type NoteText, type RatingValue, type ReasonText } from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'
import { buildReviewDraftKey } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import { DEFAULT_REVIEW_RATING, LOW_RATING_MAX, MAX_RATING, MIN_RATING } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainNumber, asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import { StarRatingField } from '@/pages/ReviewConsole/components/StarRatingField'
import type { CustomerReviewOrderContentProps, CustomerReviewSectionProps } from '@/pages/CustomerConsole/objects/CustomerReviewObjects'
import { ORDER_PAGE_COPY } from '@/pages/OrderConsole/OrderPageCopy'

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
  const draftKey = buildReviewDraftKey(order.id, reviewErrorKey)
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
        onChange={(rating) => updateReviewDraft(draftKey, { rating: asDomainNumber<RatingValue>(rating) })}
      />
      <input
        className={errorText ? 'field-error' : undefined}
        placeholder={ORDER_PAGE_COPY.review.lowRatingReasonPlaceholder(MAX_RATING)}
        value={draft?.comment ?? ''}
        onChange={(event) => updateReviewDraft(draftKey, { comment: asDomainText<ReasonText>(event.target.value) })}
      />
      <div className="review-reason-options">
        {reasonOptions.map((reason) => (
          <button
            key={reason}
            className="secondary-button review-reason-chip"
            onClick={() => updateReviewDraft(draftKey, { comment: asDomainText<ReasonText>(reason) })}
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
        onChange={(event) => updateReviewDraft(draftKey, { extraNote: asDomainText<NoteText>(event.target.value) })}
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
            {activeReviewOrder.id} · {activeReviewOrder.riderName ?? ORDER_PAGE_COPY.review.waitingRiderFallback}
          </p>
        </div>
      </div>
      <div className="review-dialog-form">
        <CustomerReviewSection
          actionHint={ORDER_PAGE_COPY.review.sectionActionHint(MAX_RATING, MIN_RATING, LOW_RATING_MAX)}
          buttonIdleLabel={ORDER_PAGE_COPY.review.storeButtonIdleLabel}
          buttonReadyLabel={ORDER_PAGE_COPY.review.storeButtonReadyLabel}
          emptyHint={ORDER_PAGE_COPY.review.storeEmptyHint}
          extraNotePlaceholder={ORDER_PAGE_COPY.review.storeExtraNotePlaceholder}
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
              ? ORDER_PAGE_COPY.review.submittedRatingSubtitle(activeReviewOrder.storeRating)
              : ORDER_PAGE_COPY.review.pendingSubtitle
          }
          title={ORDER_PAGE_COPY.review.storeTitle}
        />
        {activeReviewOrder.riderId ? (
          <CustomerReviewSection
            actionHint={ORDER_PAGE_COPY.review.riderActionHint}
            buttonIdleLabel={ORDER_PAGE_COPY.review.riderButtonIdleLabel}
            buttonReadyLabel={ORDER_PAGE_COPY.review.riderButtonReadyLabel}
            emptyHint={ORDER_PAGE_COPY.review.riderEmptyHint}
            extraNotePlaceholder={ORDER_PAGE_COPY.review.riderExtraNotePlaceholder}
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
                ? ORDER_PAGE_COPY.review.submittedRatingSubtitle(activeReviewOrder.riderRating)
                : ORDER_PAGE_COPY.review.pendingSubtitle
            }
            title={ORDER_PAGE_COPY.review.riderTitle}
          />
        ) : null}
        <div className="action-row">
          <button className="secondary-button" onClick={() => navigate(ROUTE_PATH.customerOrders)} type="button">
            {ORDER_PAGE_COPY.review.backToOrdersButton}
          </button>
        </div>
      </div>
      <p className="meta-line">{ORDER_PAGE_COPY.review.reviewWindowHint(REVIEW_WINDOW_DAYS)}</p>
    </section>
  )
}
