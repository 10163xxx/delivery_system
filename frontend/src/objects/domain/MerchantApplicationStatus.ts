export const APPLICATION_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type MerchantApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]
