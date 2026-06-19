// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const TICKET_KIND = {
  positiveReview: 'PositiveReview',
  negativeReview: 'NegativeReview',
  deliveryIssue: 'DeliveryIssue',
} as const

export type TicketKind = (typeof TICKET_KIND)[keyof typeof TICKET_KIND]
