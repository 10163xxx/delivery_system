// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
