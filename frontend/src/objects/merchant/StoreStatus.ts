// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const STORE_STATUS = {
  open: 'Open',
  busy: 'Busy',
  revoked: 'Revoked',
} as const

export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS]
