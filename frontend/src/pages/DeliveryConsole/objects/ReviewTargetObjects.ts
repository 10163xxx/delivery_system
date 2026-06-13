// Frontend-only review draft target. Backend ReviewOrderRequest carries separate
// storeReview/riderReview fields, so there is no protocol object to mirror.
export const REVIEW_TARGET = {
  store: 'store',
  rider: 'rider',
} as const

export type ReviewTargetValue = (typeof REVIEW_TARGET)[keyof typeof REVIEW_TARGET]
