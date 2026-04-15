import type {
  CustomerWorkspaceView,
  MerchantApplicationView,
  MerchantWorkspaceView,
} from '@/shared/delivery-app/DeliveryAppObjects'

export function getCustomerWorkspaceView(locationPathname: string): CustomerWorkspaceView {
  if (locationPathname.startsWith('/customer/review/')) return 'review'
  if (locationPathname.startsWith('/customer/orders/')) return 'order-detail'
  if (locationPathname === '/customer/profile/recharge') return 'recharge'
  if (locationPathname === '/customer/profile/coupons') return 'coupons'
  if (locationPathname === '/customer/profile/addresses') return 'addresses'
  if (locationPathname === '/customer/profile') return 'profile'
  if (locationPathname === '/customer/orders') return 'orders'
  return 'order'
}

export function getMerchantWorkspaceViewFromUrl(
  locationPathname: string,
): MerchantWorkspaceView {
  if (locationPathname === '/merchant/application') return 'application'
  if (locationPathname === '/merchant/profile') return 'profile'
  return 'console'
}

export function getMerchantApplicationViewFromUrl(
  searchParams: URLSearchParams,
): MerchantApplicationView {
  return (searchParams.get('merchantView') ?? 'submit') as MerchantApplicationView
}
