// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const TICKET_STATUS = {
  open: 'Open',
  resolved: 'Resolved',
} as const

export type TicketStatus = (typeof TICKET_STATUS)[keyof typeof TICKET_STATUS]
