const CUSTOMER_ORDER_WORKSPACE_VIEW = {
  order: 'order',
  cart: 'cart',
  orders: 'orders',
  orderDetail: 'order-detail',
  review: 'review',
} as const

const CUSTOMER_PROFILE_WORKSPACE_VIEW = {
  profile: 'profile',
  recharge: 'recharge',
  addresses: 'addresses',
  coupons: 'coupons',
  refunds: 'refunds',
  favorites: 'favorites',
  blockedStores: 'blocked-stores',
} as const

export const CUSTOMER_WORKSPACE_VIEW = {
  ...CUSTOMER_ORDER_WORKSPACE_VIEW,
  ...CUSTOMER_PROFILE_WORKSPACE_VIEW,
} as const

export type CustomerWorkspaceView =
  (typeof CUSTOMER_WORKSPACE_VIEW)[keyof typeof CUSTOMER_WORKSPACE_VIEW]

export const CUSTOMER_PROFILE_WORKSPACE_VIEWS = [
  CUSTOMER_WORKSPACE_VIEW.profile,
  CUSTOMER_WORKSPACE_VIEW.recharge,
  CUSTOMER_WORKSPACE_VIEW.coupons,
  CUSTOMER_WORKSPACE_VIEW.addresses,
  CUSTOMER_WORKSPACE_VIEW.refunds,
  CUSTOMER_WORKSPACE_VIEW.favorites,
  CUSTOMER_WORKSPACE_VIEW.blockedStores,
] as CustomerWorkspaceView[]

export function isCustomerProfileWorkspaceView(
  view: CustomerWorkspaceView,
): boolean {
  return CUSTOMER_PROFILE_WORKSPACE_VIEWS.includes(view)
}
