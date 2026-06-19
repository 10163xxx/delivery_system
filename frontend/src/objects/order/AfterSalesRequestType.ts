// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const AFTER_SALES_REQUEST_TYPE = {
  returnRequest: 'ReturnRequest',
  compensationRequest: 'CompensationRequest',
} as const

export type AfterSalesRequestType =
  (typeof AFTER_SALES_REQUEST_TYPE)[keyof typeof AFTER_SALES_REQUEST_TYPE]
