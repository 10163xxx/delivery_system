export const AFTER_SALES_REQUEST_TYPE = {
  returnRequest: 'ReturnRequest',
  compensationRequest: 'CompensationRequest',
} as const

export type AfterSalesRequestType =
  (typeof AFTER_SALES_REQUEST_TYPE)[keyof typeof AFTER_SALES_REQUEST_TYPE]
