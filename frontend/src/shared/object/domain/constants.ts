export const ROLE = {
  customer: 'customer',
  merchant: 'merchant',
  rider: 'rider',
  admin: 'admin',
} as const

export const REGISTERABLE_ROLES = [ROLE.customer, ROLE.merchant, ROLE.rider] as const

export const ORDER_STATUS = {
  pendingMerchantAcceptance: 'PendingMerchantAcceptance',
  preparing: 'Preparing',
  readyForPickup: 'ReadyForPickup',
  delivering: 'Delivering',
  completed: 'Completed',
  cancelled: 'Cancelled',
  escalated: 'Escalated',
} as const

export const TICKET_KIND = {
  positiveReview: 'PositiveReview',
  negativeReview: 'NegativeReview',
  deliveryIssue: 'DeliveryIssue',
} as const

export const TICKET_STATUS = {
  open: 'Open',
  resolved: 'Resolved',
} as const

export const AFTER_SALES_REQUEST_TYPE = {
  returnRequest: 'ReturnRequest',
  compensationRequest: 'CompensationRequest',
} as const

export const AFTER_SALES_RESOLUTION_MODE = {
  balance: 'Balance',
  coupon: 'Coupon',
  manual: 'Manual',
} as const

export const APPLICATION_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export const ACCOUNT_STATUS = {
  active: 'Active',
  suspended: 'Suspended',
} as const

export const STORE_STATUS = {
  open: 'Open',
  busy: 'Busy',
  revoked: 'Revoked',
} as const

export const APPEAL_STATUS = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
} as const

export const APPEAL_ROLE = {
  merchant: 'Merchant',
  rider: 'Rider',
} as const

export const ELIGIBILITY_REVIEW_TARGET = {
  store: 'Store',
  rider: 'Rider',
} as const

export const PAYOUT_ACCOUNT_TYPE = {
  alipay: 'alipay',
  bank: 'bank',
} as const

export const REVIEW_TARGET = {
  store: 'store',
  rider: 'rider',
} as const

export const REVIEW_STATUS = {
  active: 'Active',
  revoked: 'Revoked',
} as const

export const ROUTE_PATH = {
  root: '/',
  customerOrder: '/customer/order',
  customerOrders: '/customer/orders',
  customerProfile: '/customer/profile',
  customerProfileRecharge: '/customer/profile/recharge',
  customerProfileAddresses: '/customer/profile/addresses',
  merchantApplicationSubmit: '/merchant/application?merchantView=submit',
} as const
