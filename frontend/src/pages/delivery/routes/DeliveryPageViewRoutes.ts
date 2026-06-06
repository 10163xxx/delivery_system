import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  CUSTOMER_WORKSPACE_VIEW,
  MERCHANT_APPLICATION_VIEW,
  MERCHANT_WORKSPACE_VIEW,
} from '@/pages/delivery/objects/DeliveryAppObjects'
import { ROUTE_PATH, ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'

export function getCustomerWorkspaceView(locationPathname: string): CustomerWorkspaceView {
  if (locationPathname.startsWith(ROUTE_PATH.customerReviewPrefix)) return CUSTOMER_WORKSPACE_VIEW.review
  if (locationPathname.startsWith(ROUTE_PATH.customerOrdersPrefix)) return CUSTOMER_WORKSPACE_VIEW.orderDetail
  if (locationPathname === ROUTE_PATH.customerCart) return CUSTOMER_WORKSPACE_VIEW.cart
  if (locationPathname === ROUTE_PATH.customerProfileRecharge) return CUSTOMER_WORKSPACE_VIEW.recharge
  if (locationPathname === ROUTE_PATH.customerProfileCoupons) return CUSTOMER_WORKSPACE_VIEW.coupons
  if (locationPathname === ROUTE_PATH.customerProfileAddresses) return CUSTOMER_WORKSPACE_VIEW.addresses
  if (locationPathname === ROUTE_PATH.customerProfileRefunds) return CUSTOMER_WORKSPACE_VIEW.refunds
  if (locationPathname === ROUTE_PATH.customerProfileFavorites) return CUSTOMER_WORKSPACE_VIEW.favorites
  if (locationPathname === ROUTE_PATH.customerProfileBlockedStores) return CUSTOMER_WORKSPACE_VIEW.blockedStores
  if (locationPathname === ROUTE_PATH.customerProfile) return CUSTOMER_WORKSPACE_VIEW.profile
  if (locationPathname === ROUTE_PATH.customerOrders) return CUSTOMER_WORKSPACE_VIEW.orders
  return CUSTOMER_WORKSPACE_VIEW.order
}

export function getMerchantWorkspaceViewFromUrl(
  locationPathname: string,
): MerchantWorkspaceView {
  if (locationPathname === ROUTE_PATH.merchantApplication) return MERCHANT_WORKSPACE_VIEW.application
  if (locationPathname === ROUTE_PATH.merchantOrders) return MERCHANT_WORKSPACE_VIEW.orders
  if (locationPathname === ROUTE_PATH.merchantStore) return MERCHANT_WORKSPACE_VIEW.store
  if (locationPathname.startsWith(ROUTE_PATH.merchantProfile)) return MERCHANT_WORKSPACE_VIEW.profile
  if (locationPathname === ROUTE_PATH.merchantConsole) return MERCHANT_WORKSPACE_VIEW.store
  return MERCHANT_WORKSPACE_VIEW.store
}

export function getMerchantApplicationViewFromUrl(
  searchParams: URLSearchParams,
): MerchantApplicationView {
  const merchantView = searchParams.get(ROUTE_QUERY_KEY.merchantView)
  if (merchantView === MERCHANT_APPLICATION_VIEW.pending) return MERCHANT_APPLICATION_VIEW.pending
  if (merchantView === MERCHANT_APPLICATION_VIEW.reviewed) return MERCHANT_APPLICATION_VIEW.reviewed
  return MERCHANT_APPLICATION_VIEW.submit
}
