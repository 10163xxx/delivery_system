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
} from '@/shared/object/SharedObjects'

const API_BASE_PATH = '/api'
const DELIVERY_BASE_PATH = `${API_BASE_PATH}/delivery`
const AUTH_BASE_PATH = `${API_BASE_PATH}/auth`

export const AUTH_API_ROUTE = {
  login: `${AUTH_BASE_PATH}/login`,
  register: `${AUTH_BASE_PATH}/register`,
  session: `${AUTH_BASE_PATH}/session`,
  logout: `${AUTH_BASE_PATH}/logout`,
} as const

export const DELIVERY_API_ROUTE = {
  state: `${DELIVERY_BASE_PATH}/state`,
  merchantProfile: `${DELIVERY_BASE_PATH}/merchant-profile`,
  merchantWithdraw: `${DELIVERY_BASE_PATH}/merchant-profile/withdraw`,
  merchantApplications: `${DELIVERY_BASE_PATH}/merchant-applications`,
  eligibilityReviews: `${DELIVERY_BASE_PATH}/eligibility-reviews`,
  orders: `${DELIVERY_BASE_PATH}/orders`,
  storeImageUpload: `${DELIVERY_BASE_PATH}/uploads/store-image`,
  customerProfile: (customerId: CustomerId) => `${DELIVERY_BASE_PATH}/customers/${customerId}/profile`,
  customerAddresses: (customerId: CustomerId) => `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses`,
  customerAddressRemove: (customerId: CustomerId) => `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses/remove`,
  customerAddressDefault: (customerId: CustomerId) => `${DELIVERY_BASE_PATH}/customers/${customerId}/addresses/default`,
  customerRecharge: (customerId: CustomerId) => `${DELIVERY_BASE_PATH}/customers/${customerId}/recharge`,
  riderProfile: (riderId: RiderId) => `${DELIVERY_BASE_PATH}/riders/${riderId}/profile`,
  riderWithdraw: (riderId: RiderId) => `${DELIVERY_BASE_PATH}/riders/${riderId}/withdraw`,
  merchantApplicationApprove: (applicationId: MerchantApplicationId) =>
    `${DELIVERY_BASE_PATH}/merchant-applications/${applicationId}/approve`,
  merchantApplicationReject: (applicationId: MerchantApplicationId) =>
    `${DELIVERY_BASE_PATH}/merchant-applications/${applicationId}/reject`,
  reviewAppealReview: (appealId: ReviewAppealId) => `${DELIVERY_BASE_PATH}/review-appeals/${appealId}/review`,
  eligibilityReview: (reviewId: EligibilityReviewId) => `${DELIVERY_BASE_PATH}/eligibility-reviews/${reviewId}/review`,
  storeMenu: (storeId: StoreId) => `${DELIVERY_BASE_PATH}/stores/${storeId}/menu`,
  storeMenuItemRemove: (storeId: StoreId, menuItemId: MenuItemId) =>
    `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/remove`,
  storeMenuItemStock: (storeId: StoreId, menuItemId: MenuItemId) =>
    `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/stock`,
  storeMenuItemPrice: (storeId: StoreId, menuItemId: MenuItemId) =>
    `${DELIVERY_BASE_PATH}/stores/${storeId}/menu/${menuItemId}/price`,
  storeOperations: (storeId: StoreId) => `${DELIVERY_BASE_PATH}/stores/${storeId}/operations`,
  order: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}`,
  orderAccept: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/accept`,
  orderReject: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/reject`,
  orderReady: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/ready`,
  orderAssignRider: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/assign-rider`,
  orderPickup: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/pickup`,
  orderDeliver: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/deliver`,
  orderReview: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/review`,
  orderChat: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/chat`,
  orderPartialRefunds: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/partial-refunds`,
  orderAfterSales: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/after-sales`,
  orderReviewAppeals: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/review-appeals`,
  orderResolve: (orderId: OrderId) => `${DELIVERY_BASE_PATH}/orders/${orderId}/resolve`,
  partialRefundReview: (refundId: RefundRequestId) => `${DELIVERY_BASE_PATH}/partial-refunds/${refundId}/review`,
  afterSalesReview: (ticketId: TicketId) => `${DELIVERY_BASE_PATH}/tickets/${ticketId}/after-sales/review`,
} as const
