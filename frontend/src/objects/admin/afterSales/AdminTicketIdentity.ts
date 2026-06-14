import type {
  OrderId,
  SummaryText,
  TicketId,
  TicketKind,
  TicketStatus,
} from '@/objects/core/SharedObjects'

export type AdminTicketIdentity = {
  id: TicketId
  orderId: OrderId
  kind: TicketKind
  status: TicketStatus
  summary: SummaryText
}
