import type { OrderSummary } from '@/objects/core/SharedObjects'

export const CUSTOMER_ORDER_SECTION = {
  all: 'all',
  active: 'active',
  review: 'review',
  none: '',
} as const

export type CustomerOrderSection =
  (typeof CUSTOMER_ORDER_SECTION)[keyof typeof CUSTOMER_ORDER_SECTION]

export type CustomerOrderSectionData = {
  title: string
  count: number
  orders: OrderSummary[]
  emptyText: string
}
