// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const AFTER_SALES_RESOLUTION_MODE = {
  balance: 'Balance',
  coupon: 'Coupon',
  manual: 'Manual',
} as const

export type AfterSalesResolutionMode =
  (typeof AFTER_SALES_RESOLUTION_MODE)[keyof typeof AFTER_SALES_RESOLUTION_MODE]
