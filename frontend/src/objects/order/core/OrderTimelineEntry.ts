// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { DisplayText, IsoDateTime, OrderStatus } from '@/objects/core/SharedObjects'

export type OrderTimelineEntry = {
  status: OrderStatus
  note: DisplayText
  at: IsoDateTime
}
