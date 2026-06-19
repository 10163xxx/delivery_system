// Business note: frontend mirror of backend system object/support code used by protocol and app state boundaries.
// Frontend counterpart to backend RoutingValueTypes.scala. The backend stores
// route fragments as value classes, while the frontend needs literal route maps
// for React Router and URL builders.
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
  merchantStore: '/merchant/store',
  merchantOrders: '/merchant/orders',
  merchantConsole: '/merchant/console',
  merchantProfile: '/merchant/profile',
  merchantProfileAnalytics: '/merchant/profile/analytics',
} as const

export const ROUTE_PATH_PREFIX = {
  customer: '/customer/',
  merchant: '/merchant/',
} as const

export const ROUTE_QUERY_KEY = {
  category: 'category',
  merchantView: 'merchantView',
  store: 'store',
} as const
