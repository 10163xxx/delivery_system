export const ELIGIBILITY_REVIEW_TARGET = {
  store: 'Store',
  rider: 'Rider',
} as const

export type EligibilityReviewTarget =
  (typeof ELIGIBILITY_REVIEW_TARGET)[keyof typeof ELIGIBILITY_REVIEW_TARGET]
