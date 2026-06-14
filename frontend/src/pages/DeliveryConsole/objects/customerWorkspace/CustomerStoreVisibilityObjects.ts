export const CUSTOMER_STORE_VISIBILITY = {
  orderableOnly: 'orderable-only',
  all: 'all',
} as const

export type CustomerStoreVisibility =
  (typeof CUSTOMER_STORE_VISIBILITY)[keyof typeof CUSTOMER_STORE_VISIBILITY]
