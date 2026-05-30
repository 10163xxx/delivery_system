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

export const PARTIAL_REFUND_STATUS = {
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

export const MEMBERSHIP_TIER = {
  standard: 'Standard',
  member: 'Member',
} as const

export const RIDER_AVAILABILITY = {
  available: 'Available',
  onDelivery: 'OnDelivery',
  unavailable: 'Unavailable',
  suspended: 'Suspended',
} as const

export const STORE_CATEGORY = {
  chineseFastFood: '中式快餐',
  riceMeals: '盖饭简餐',
  noodles: '面馆粉档',
  spicyPot: '麻辣香锅',
  dumplings: '饺子馄饨',
  salads: '轻食沙拉',
  cafeDesserts: '咖啡甜点',
  teaDrinks: '奶茶果饮',
  lateNightSnacks: '夜宵小吃',
} as const

export const NOTE_STATUS = {
  draft: 'draft',
  published: 'published',
} as const

export const ROUTE_PATH = {
  root: '/',
  customerOrder: '/customer/order',
  customerCart: '/customer/cart',
  customerOrders: '/customer/orders',
  customerOrdersPrefix: '/customer/orders/',
  customerReviewPrefix: '/customer/review/',
  customerProfile: '/customer/profile',
  customerProfileRecharge: '/customer/profile/recharge',
  customerProfileCoupons: '/customer/profile/coupons',
  customerProfileAddresses: '/customer/profile/addresses',
  customerProfileRefunds: '/customer/profile/refunds',
  customerProfileFavorites: '/customer/profile/favorites',
  customerProfileBlockedStores: '/customer/profile/blocked-stores',
  merchantApplication: '/merchant/application',
  merchantApplicationSubmit: '/merchant/application?merchantView=submit',
  merchantConsole: '/merchant/console',
  merchantProfile: '/merchant/profile',
  merchantProfileAnalytics: '/merchant/profile/analytics',
} as const

export const ROUTE_QUERY_KEY = {
  merchantView: 'merchantView',
  store: 'store',
} as const
