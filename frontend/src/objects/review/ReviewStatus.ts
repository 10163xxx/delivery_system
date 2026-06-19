// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const REVIEW_STATUS = {
  active: 'Active',
  revoked: 'Revoked',
} as const

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]
