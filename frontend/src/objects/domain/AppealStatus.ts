export const APPEAL_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type AppealStatus = (typeof APPEAL_STATUS)[keyof typeof APPEAL_STATUS]
