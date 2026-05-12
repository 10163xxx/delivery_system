import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import {
  CUSTOMER_WORKSPACE_VIEW,
  MERCHANT_APPLICATION_VIEW,
  MERCHANT_WORKSPACE_VIEW,
} from '@/shared/object/core/DeliveryAppObjects'

export function getCustomerWorkspaceView(locationPathname: string): CustomerWorkspaceView {
  if (locationPathname.startsWith('/customer/review/')) return CUSTOMER_WORKSPACE_VIEW.review
  if (locationPathname.startsWith('/customer/orders/')) return CUSTOMER_WORKSPACE_VIEW.orderDetail
  if (locationPathname === '/customer/profile/recharge') return CUSTOMER_WORKSPACE_VIEW.recharge
  if (locationPathname === '/customer/profile/coupons') return CUSTOMER_WORKSPACE_VIEW.coupons
  if (locationPathname === '/customer/profile/addresses') return CUSTOMER_WORKSPACE_VIEW.addresses
  if (locationPathname === '/customer/profile') return CUSTOMER_WORKSPACE_VIEW.profile
  if (locationPathname === '/customer/orders') return CUSTOMER_WORKSPACE_VIEW.orders
  return CUSTOMER_WORKSPACE_VIEW.order
}

export function getMerchantWorkspaceViewFromUrl(
  locationPathname: string,
): MerchantWorkspaceView {
  if (locationPathname === '/merchant/application') return MERCHANT_WORKSPACE_VIEW.application
  if (locationPathname.startsWith('/merchant/profile')) return MERCHANT_WORKSPACE_VIEW.profile
  return MERCHANT_WORKSPACE_VIEW.console
}

export function getMerchantApplicationViewFromUrl(
  searchParams: URLSearchParams,
): MerchantApplicationView {
  const merchantView = searchParams.get('merchantView')
  if (merchantView === MERCHANT_APPLICATION_VIEW.pending) return MERCHANT_APPLICATION_VIEW.pending
  if (merchantView === MERCHANT_APPLICATION_VIEW.reviewed) return MERCHANT_APPLICATION_VIEW.reviewed
  return MERCHANT_APPLICATION_VIEW.submit
}
