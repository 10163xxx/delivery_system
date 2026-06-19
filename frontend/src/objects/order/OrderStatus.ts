// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
export const ORDER_STATUS = {
  pendingMerchantAcceptance: 'PendingMerchantAcceptance',
  preparing: 'Preparing',
  readyForPickup: 'ReadyForPickup',
  delivering: 'Delivering',
  completed: 'Completed',
  cancelled: 'Cancelled',
  escalated: 'Escalated',
} as const

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]
