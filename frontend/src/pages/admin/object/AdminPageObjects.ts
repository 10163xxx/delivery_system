import type { Dispatch, SetStateAction } from 'react'

export const AFTER_SALES_QUEUE = {
  open: 'open',
  resolved: 'resolved',
  all: 'all',
} as const

export type AfterSalesQueue =
  (typeof AFTER_SALES_QUEUE)[keyof typeof AFTER_SALES_QUEUE]

export type AfterSalesDateRange = {
  from: string
  to: string
}

export type AfterSalesQueueOption = {
  value: AfterSalesQueue
  label: string
}

export type AfterSalesDateRangeFilterProps = {
  dateRange: AfterSalesDateRange
  resetDateRange: () => void
  updateDateRange: (field: keyof AfterSalesDateRange, value: string) => void
}

export type AfterSalesPaginationProps = {
  currentPage: number
  pageCount: number
  setSelectedPage: Dispatch<SetStateAction<number>>
}
