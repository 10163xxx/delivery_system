import type {
  AddressLabel,
  AddressText,
  CustomerId,
  DisplayText,
  OrderId,
  ResolveTicketRequest,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ROUTE_PATH, ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'

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

export type CustomerAddressDraft = {
  label: AddressLabel
  address: AddressText
}

export const CUSTOMER_ADDRESS_FIELD = {
  label: 'label',
  address: 'address',
} as const

export type CustomerAddressField =
  (typeof CUSTOMER_ADDRESS_FIELD)[keyof typeof CUSTOMER_ADDRESS_FIELD]

export const ORDER_RESTORE_MODE = {
  cart: 'cart',
  checkout: 'checkout',
} as const

export type OrderRestoreMode =
  (typeof ORDER_RESTORE_MODE)[keyof typeof ORDER_RESTORE_MODE]

export const CUSTOMER_STORE_VISIBILITY = {
  orderableOnly: 'orderable-only',
  all: 'all',
} as const

export type CustomerStoreVisibility =
  (typeof CUSTOMER_STORE_VISIBILITY)[keyof typeof CUSTOMER_STORE_VISIBILITY]

export type ResolutionDraftMap = Record<OrderId, ResolveTicketRequest>

export type RoutePathValue = (typeof ROUTE_PATH)[keyof typeof ROUTE_PATH]

export type CustomerOrderRoutePath =
  | typeof ROUTE_PATH.customerOrder
  | typeof ROUTE_PATH.customerCart
  | typeof ROUTE_PATH.customerOrders
  | typeof ROUTE_PATH.customerProfile
  | typeof ROUTE_PATH.customerProfileRecharge
  | typeof ROUTE_PATH.customerProfileCoupons
  | typeof ROUTE_PATH.customerProfileAddresses
  | typeof ROUTE_PATH.customerProfileRefunds
  | typeof ROUTE_PATH.customerProfileFavorites
  | typeof ROUTE_PATH.customerProfileBlockedStores

export type CustomerOrderDetailRoutePath = `${typeof ROUTE_PATH.customerOrdersPrefix}${OrderId}`
export type CustomerReviewRoutePath = `${typeof ROUTE_PATH.customerReviewPrefix}${OrderId}`
export type CustomerStoreQueryRoutePath =
  | `${typeof ROUTE_PATH.customerOrder}?${typeof ROUTE_QUERY_KEY.store}=${StoreId}`
  | `${typeof ROUTE_PATH.customerCart}?${typeof ROUTE_QUERY_KEY.store}=${StoreId}`

export function buildCustomerOrderDetailRoute(orderId: OrderId): CustomerOrderDetailRoutePath {
  return `${ROUTE_PATH.customerOrdersPrefix}${orderId}`
}

export function buildCustomerReviewRoute(orderId: OrderId): CustomerReviewRoutePath {
  return `${ROUTE_PATH.customerReviewPrefix}${orderId}`
}

export function buildCustomerOrderStoreRoute(storeId: StoreId): CustomerStoreQueryRoutePath {
  return `${ROUTE_PATH.customerOrder}?${ROUTE_QUERY_KEY.store}=${storeId}`
}

export function buildCustomerCartStoreRoute(storeId: StoreId): CustomerStoreQueryRoutePath {
  return `${ROUTE_PATH.customerCart}?${ROUTE_QUERY_KEY.store}=${storeId}`
}

export type CustomerStoreQuerySelection = {
  storeId: StoreId
}

export type CustomerAddressOwnerSelection = {
  customerId: CustomerId
}

export type CustomerWorkspaceRouteMeta = {
  title: DisplayText
  path: RoutePathValue
}
