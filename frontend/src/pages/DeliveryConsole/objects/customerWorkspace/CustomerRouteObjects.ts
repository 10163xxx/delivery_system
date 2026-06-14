import type {
  DisplayText,
  OrderId,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ROUTE_PATH, ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'

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

export type CustomerWorkspaceRouteMeta = {
  title: DisplayText
  path: RoutePathValue
}
