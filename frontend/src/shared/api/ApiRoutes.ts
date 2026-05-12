import type {
  CustomerId,
  EligibilityReviewId,
  MerchantApplicationId,
  MenuItemId,
  OrderId,
  RefundRequestId,
  ReviewAppealId,
  RiderId,
  StoreId,
  TicketId,
} from '@/shared/object/core/SharedObjects'

const API_BASE_PATH = '/api'
const DELIVERY_BASE_PATH = `${API_BASE_PATH}/delivery`
const AUTH_BASE_PATH = `${API_BASE_PATH}/auth`

export const AUTH_LOGIN_API_ROUTE = `${AUTH_BASE_PATH}/login`
export const AUTH_REGISTER_API_ROUTE = `${AUTH_BASE_PATH}/register`
export const AUTH_SESSION_API_ROUTE = `${AUTH_BASE_PATH}/session`
export const AUTH_LOGOUT_API_ROUTE = `${AUTH_BASE_PATH}/logout`

export const DELIVERY_STATE_API_ROUTE = `${DELIVERY_BASE_PATH}/state`
export const DELIVERY_MERCHANT_PROFILE_API_ROUTE = `${DELIVERY_BASE_PATH}/merchant-profile`
export const DELIVERY_MERCHANT_WITHDRAW_API_ROUTE = `${DELIVERY_BASE_PATH}/merchant-profile/withdraw`
export const DELIVERY_MERCHANT_APPLICATIONS_API_ROUTE = `${DELIVERY_BASE_PATH}/merchant-applications`
export const DELIVERY_ELIGIBILITY_REVIEWS_API_ROUTE = `${DELIVERY_BASE_PATH}/eligibility-reviews`
export const DELIVERY_ORDERS_API_ROUTE = `${DELIVERY_BASE_PATH}/orders`
export const DELIVERY_STORE_IMAGE_UPLOAD_API_ROUTE = `${DELIVERY_BASE_PATH}/uploads/store-image`

export function getCustomerProfileApiRoute(customerId: CustomerId) {
  return `${DELIVERY_BASE_PATH}/customers/${customerId}/profile`
}

export function getCustomerAddressesApiRoute(customerId: CustomerId) {
  return `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses`
}

export function getCustomerAddressRemoveApiRoute(customerId: CustomerId) {
  return `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses/remove`
}

export function getCustomerAddressDefaultApiRoute(customerId: CustomerId) {
  return `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses/default`
}

export function getCustomerRechargeApiRoute(customerId: CustomerId) {
  return `${DELIVERY_BASE_PATH}/customers/${customerId}/recharge`
}

export function getRiderProfileApiRoute(riderId: RiderId) {
  return `${DELIVERY_BASE_PATH}/riders/${riderId}/profile`
}

export function getRiderWithdrawApiRoute(riderId: RiderId) {
  return `${DELIVERY_BASE_PATH}/riders/${riderId}/withdraw`
}

export function getMerchantApplicationApproveApiRoute(applicationId: MerchantApplicationId) {
  return `${DELIVERY_BASE_PATH}/merchant-applications/${applicationId}/approve`
}

export function getMerchantApplicationRejectApiRoute(applicationId: MerchantApplicationId) {
  return `${DELIVERY_BASE_PATH}/merchant-applications/${applicationId}/reject`
}

export function getReviewAppealReviewApiRoute(appealId: ReviewAppealId) {
  return `${DELIVERY_BASE_PATH}/review-appeals/${appealId}/review`
}

export function getEligibilityReviewApiRoute(reviewId: EligibilityReviewId) {
  return `${DELIVERY_BASE_PATH}/eligibility-reviews/${reviewId}/review`
}

export function getStoreMenuApiRoute(storeId: StoreId) {
  return `${DELIVERY_BASE_PATH}/stores/${storeId}/menu`
}

export function getStoreMenuItemRemoveApiRoute(storeId: StoreId, menuItemId: MenuItemId) {
  return `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/remove`
}

export function getStoreMenuItemStockApiRoute(storeId: StoreId, menuItemId: MenuItemId) {
  return `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/stock`
}

export function getStoreMenuItemPriceApiRoute(storeId: StoreId, menuItemId: MenuItemId) {
  return `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/price`
}

export function getStoreOperationsApiRoute(storeId: StoreId) {
  return `${DELIVERY_BASE_PATH}/stores/${storeId}/operations`
}

export function getOrderApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}`
}

export function getOrderAcceptApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/accept`
}

export function getOrderRejectApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/reject`
}

export function getOrderReadyApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/ready`
}

export function getOrderAssignRiderApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/assign-rider`
}

export function getOrderPickupApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/pickup`
}

export function getOrderDeliverApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/deliver`
}

export function getOrderReviewApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/review`
}

export function getOrderChatApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/chat`
}

export function getOrderPartialRefundsApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/partial-refunds`
}

export function getOrderAfterSalesApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/after-sales`
}

export function getOrderReviewAppealsApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/review-appeals`
}

export function getOrderResolveApiRoute(orderId: OrderId) {
  return `${DELIVERY_BASE_PATH}/orders/${orderId}/resolve`
}

export function getPartialRefundReviewApiRoute(refundId: RefundRequestId) {
  return `${DELIVERY_BASE_PATH}/partial-refunds/${refundId}/review`
}

export function getAfterSalesReviewApiRoute(ticketId: TicketId) {
  return `${DELIVERY_BASE_PATH}/tickets/${ticketId}/after-sales/review`
}
