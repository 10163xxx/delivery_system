import type { IsoDateTime, NoteText, OrderStatus } from '@/shared/object/domain/DomainObjects'

export type OrderTimelineEntry = {
  status: OrderStatus
  note: NoteText
  at: IsoDateTime
}
