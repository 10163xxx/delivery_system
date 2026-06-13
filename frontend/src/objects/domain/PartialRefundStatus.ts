export const PARTIAL_REFUND_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type PartialRefundStatus =
  (typeof PARTIAL_REFUND_STATUS)[keyof typeof PARTIAL_REFUND_STATUS]
