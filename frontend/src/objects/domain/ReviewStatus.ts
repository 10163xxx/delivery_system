export const REVIEW_STATUS = {
  active: 'Active',
  revoked: 'Revoked',
} as const

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]
