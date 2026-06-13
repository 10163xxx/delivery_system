import type { DisplayText, IsoDateTime, OrderStatus } from '@/objects/core/SharedObjects'

export type OrderTimelineEntry = {
  status: OrderStatus
  note: DisplayText
  at: IsoDateTime
}
