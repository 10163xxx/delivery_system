// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const APPLICATION_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type MerchantApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]
