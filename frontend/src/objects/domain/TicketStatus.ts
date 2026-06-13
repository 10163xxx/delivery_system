export const TICKET_STATUS = {
  open: 'Open',
  resolved: 'Resolved',
} as const

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]
