export const STORE_STATUS = {
  open: 'Open',
  busy: 'Busy',
  revoked: 'Revoked',
} as const

export type StoreStatus = (typeof STORE_STATUS)[keyof typeof STORE_STATUS]
