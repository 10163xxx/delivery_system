export const AFTER_SALES_RESOLUTION_MODE = {
  balance: 'Balance',
  coupon: 'Coupon',
  manual: 'Manual',
} as const

export type AfterSalesResolutionMode =
  (typeof AFTER_SALES_RESOLUTION_MODE)[keyof typeof AFTER_SALES_RESOLUTION_MODE]
