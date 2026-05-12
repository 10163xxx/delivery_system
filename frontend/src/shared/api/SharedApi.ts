import { adminApi } from '@/admin/api/AdminApi'
import { authApi } from '@/auth/api/AuthApi'
import { customerApi } from '@/customer/api/CustomerApi'
import { merchantApi } from '@/merchant/api/MerchantApi'
import { orderApi } from '@/order/api/OrderApi'
import { reviewApi } from '@/review/api/ReviewApi'
import { riderApi } from '@/rider/api/RiderApi'

export { browserRuntime } from '@/shared/api/BrowserRuntime'
export { browserStorage, getCustomerProfileNoticeSeenStorageKey } from '@/shared/api/BrowserStorage'
export { adminApi } from '@/admin/api/AdminApi'
export { authApi } from '@/auth/api/AuthApi'
export { customerApi } from '@/customer/api/CustomerApi'
export { merchantApi } from '@/merchant/api/MerchantApi'
export { orderApi } from '@/order/api/OrderApi'
export { reviewApi } from '@/review/api/ReviewApi'
export { riderApi } from '@/rider/api/RiderApi'
export * from '@/admin/api/AdminApi'
export * from '@/auth/api/AuthApi'
export * from '@/customer/api/CustomerApi'
export * from '@/merchant/api/MerchantApi'
export * from '@/order/api/OrderApi'
export * from '@/review/api/ReviewApi'
export * from '@/rider/api/RiderApi'

export const deliveryApi = {
  admin: adminApi,
  auth: authApi,
  customer: customerApi,
  merchant: merchantApi,
  order: orderApi,
  review: reviewApi,
  rider: riderApi,
}
