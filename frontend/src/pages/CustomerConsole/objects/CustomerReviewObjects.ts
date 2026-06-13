import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { OrderSummary } from '@/objects/core/SharedObjects'
import { REVIEW_TARGET } from '@/pages/DeliveryConsole/objects/ReviewTargetObjects'

type CustomerReviewSectionCopy = {
  title: string
  subtitle: string
  actionHint: string
  emptyHint: string
  extraNotePlaceholder: string
  buttonReadyLabel: string
  buttonIdleLabel: string
}

type CustomerReviewSectionState = {
  order: OrderSummary
  reasonOptions: string[]
  reviewErrorKey: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider
  reviewTarget: typeof REVIEW_TARGET.store | typeof REVIEW_TARGET.rider
}

type CustomerReviewSectionBindings = Pick<
  CustomerRoleProps,
  'reviewDrafts' | 'reviewErrors' | 'submitReview' | 'updateReviewDraft'
> & {
  hasPendingReview: CustomerRoleProps['hasPendingStoreReview']
}

export type CustomerReviewSectionProps = CustomerReviewSectionCopy &
  CustomerReviewSectionState & {
    props: CustomerReviewSectionBindings
  }

type CustomerReviewOrderContentBindings = Pick<
  CustomerRoleProps,
  | 'activeReviewOrder'
  | 'reviewDrafts'
  | 'reviewErrors'
  | 'submitReview'
  | 'updateReviewDraft'
  | 'STORE_REVIEW_REASON_OPTIONS'
  | 'RIDER_REVIEW_REASON_OPTIONS'
  | 'hasPendingStoreReview'
  | 'hasPendingRiderReview'
  | 'navigate'
  | 'REVIEW_WINDOW_DAYS'
>

export type CustomerReviewOrderContentProps = {
  props: CustomerReviewOrderContentBindings
}
