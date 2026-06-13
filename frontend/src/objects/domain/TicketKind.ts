export const TICKET_KIND = {
  positiveReview: 'PositiveReview',
  negativeReview: 'NegativeReview',
  deliveryIssue: 'DeliveryIssue',
} as const

export type TicketKind = (typeof TICKET_KIND)[keyof typeof TICKET_KIND]
