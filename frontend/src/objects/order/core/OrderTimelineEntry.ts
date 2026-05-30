import type { DisplayText, IsoDateTime, OrderStatus } from '@/objects/domain/DomainObjects'

export type OrderTimelineEntry = {
  status: OrderStatus
  note: DisplayText
  at: IsoDateTime
}
