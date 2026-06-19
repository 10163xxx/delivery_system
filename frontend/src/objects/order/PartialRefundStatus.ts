// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const PARTIAL_REFUND_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type PartialRefundStatus =
  (typeof PARTIAL_REFUND_STATUS)[keyof typeof PARTIAL_REFUND_STATUS]
