// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const APPEAL_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export type AppealStatus = (typeof APPEAL_STATUS)[keyof typeof APPEAL_STATUS]
