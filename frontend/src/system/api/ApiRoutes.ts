import type {
  AddMenuItemRequest,
  AddCustomerAddressRequest,
  AppendStoreReviewReplyRequest,
  AssignRiderRequest,
  AuthSession,
  CreateOrderRequest,
  CustomerId,
  DeliveryAppState,
  EligibilityReviewId,
  EligibilityReviewRequest,
  ImageUploadResponse,
  LoginRequest,
  MenuItemId,
  MerchantApplicationId,
  MerchantRegistrationRequest,
  OrderId,
  RechargeBalanceRequest,
  RefundRequestId,
  RegisterRequest,
  RejectOrderRequest,
  RemoveCustomerAddressRequest,
  ResolveAfterSalesRequest,
  ResolveEligibilityReviewRequest,
  ResolvePartialRefundRequest,
  ResolveReviewAppealRequest,
  ResolveTicketRequest,
  ReviewAppealId,
  ReviewAppealRequest,
  ReviewMerchantApplicationRequest,
  ReviewOrderRequest,
  RiderId,
  SendOrderChatMessageRequest,
  SetDefaultCustomerAddressRequest,
  StoreId,
  SubmitAfterSalesRequest,
  SubmitPartialRefundRequest,
  TicketId,
  UpdateCustomerProfileRequest,
  UpdateMenuItemCategoryRequest,
  UpdateMenuItemPriceRequest,
  UpdateMenuItemStockRequest,
  UpdateMerchantProfileRequest,
  UpdateRiderAvailabilityRequest,
  UpdateRiderProfileRequest,
  UpdateStoreOperationalRequest,
  WithdrawMerchantIncomeRequest,
  WithdrawRiderIncomeRequest,
} from '@/objects/core/SharedObjects'
import {
  defineJsonGetApi0,
  defineJsonPostApi0,
  defineJsonPostApi1,
  defineJsonPostApi2,
  defineUploadPostApi0,
  routeSegment,
} from '@/system/api/TypedApiDefinitions'

const apiSegment = routeSegment('api')
const authSegment = routeSegment('auth')
const deliverySegment = routeSegment('delivery')
const customersSegment = routeSegment('customers')
const ridersSegment = routeSegment('riders')
const merchantApplicationsSegment = routeSegment('merchant-applications')
const reviewAppealsSegment = routeSegment('review-appeals')
const eligibilityReviewsSegment = routeSegment('eligibility-reviews')
const storesSegment = routeSegment('stores')
const ordersSegment = routeSegment('orders')
const ticketsSegment = routeSegment('tickets')
const partialRefundsSegment = routeSegment('partial-refunds')

export const loginApiDefinition = defineJsonPostApi0<LoginRequest, AuthSession>([
  apiSegment,
  authSegment,
  routeSegment('login'),
])

export const registerApiDefinition = defineJsonPostApi0<RegisterRequest, AuthSession>([
  apiSegment,
  authSegment,
  routeSegment('register'),
])

export const getSessionApiDefinition = defineJsonGetApi0<AuthSession>([
  apiSegment,
  authSegment,
  routeSegment('session'),
])

export const logoutApiDefinition = defineJsonPostApi0<void, void>([
  apiSegment,
  authSegment,
  routeSegment('logout'),
])

export const getStateApiDefinition = defineJsonGetApi0<DeliveryAppState>([
  apiSegment,
  deliverySegment,
  routeSegment('state'),
])

export const updateMerchantProfileApiDefinition =
  defineJsonPostApi0<UpdateMerchantProfileRequest, DeliveryAppState>([
    apiSegment,
    deliverySegment,
    routeSegment('merchant-profile'),
  ])

export const withdrawMerchantIncomeApiDefinition =
  defineJsonPostApi0<WithdrawMerchantIncomeRequest, DeliveryAppState>([
    apiSegment,
    deliverySegment,
    routeSegment('merchant-profile'),
    routeSegment('withdraw'),
  ])

export const submitMerchantApplicationApiDefinition =
  defineJsonPostApi0<MerchantRegistrationRequest, DeliveryAppState>([
    apiSegment,
    deliverySegment,
    merchantApplicationsSegment,
  ])

export const submitEligibilityReviewApiDefinition =
  defineJsonPostApi0<EligibilityReviewRequest, DeliveryAppState>([
    apiSegment,
    deliverySegment,
    eligibilityReviewsSegment,
  ])

export const createOrderApiDefinition = defineJsonPostApi0<CreateOrderRequest, DeliveryAppState>([
  apiSegment,
  deliverySegment,
  ordersSegment,
])

export const uploadMerchantStoreImageApiDefinition = defineUploadPostApi0<ImageUploadResponse>([
  apiSegment,
  deliverySegment,
  routeSegment('uploads'),
  routeSegment('store-image'),
])

export const updateCustomerProfileApiDefinition =
  defineJsonPostApi1<CustomerId, UpdateCustomerProfileRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, customersSegment],
    [routeSegment('profile')],
  )

export const addCustomerAddressApiDefinition =
  defineJsonPostApi1<CustomerId, AddCustomerAddressRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, customersSegment],
    [routeSegment('addresses')],
  )

export const removeCustomerAddressApiDefinition =
  defineJsonPostApi1<CustomerId, RemoveCustomerAddressRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, customersSegment],
    [routeSegment('addresses'), routeSegment('remove')],
  )

export const setDefaultCustomerAddressApiDefinition =
  defineJsonPostApi1<CustomerId, SetDefaultCustomerAddressRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, customersSegment],
    [routeSegment('addresses'), routeSegment('default')],
  )

export const rechargeCustomerBalanceApiDefinition =
  defineJsonPostApi1<CustomerId, RechargeBalanceRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, customersSegment],
    [routeSegment('recharge')],
  )

export const updateRiderProfileApiDefinition =
  defineJsonPostApi1<RiderId, UpdateRiderProfileRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ridersSegment],
    [routeSegment('profile')],
  )

export const withdrawRiderIncomeApiDefinition =
  defineJsonPostApi1<RiderId, WithdrawRiderIncomeRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ridersSegment],
    [routeSegment('withdraw')],
  )

export const updateRiderAvailabilityApiDefinition =
  defineJsonPostApi1<RiderId, UpdateRiderAvailabilityRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ridersSegment],
    [routeSegment('availability')],
  )

export const approveMerchantApplicationApiDefinition =
  defineJsonPostApi1<MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, merchantApplicationsSegment],
    [routeSegment('approve')],
  )

export const rejectMerchantApplicationApiDefinition =
  defineJsonPostApi1<MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, merchantApplicationsSegment],
    [routeSegment('reject')],
  )

export const resolveReviewAppealApiDefinition =
  defineJsonPostApi1<ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, reviewAppealsSegment],
    [routeSegment('review')],
  )

export const resolveEligibilityReviewApiDefinition =
  defineJsonPostApi1<EligibilityReviewId, ResolveEligibilityReviewRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, eligibilityReviewsSegment],
    [routeSegment('review')],
  )

export const addMenuItemApiDefinition =
  defineJsonPostApi1<StoreId, AddMenuItemRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('menu')],
  )

export const updateStoreOperationalInfoApiDefinition =
  defineJsonPostApi1<StoreId, UpdateStoreOperationalRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('operations')],
  )

export const acceptOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [apiSegment, deliverySegment, ordersSegment],
  [routeSegment('accept')],
)

export const rejectOrderApiDefinition =
  defineJsonPostApi1<OrderId, RejectOrderRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('reject')],
  )

export const readyOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [apiSegment, deliverySegment, ordersSegment],
  [routeSegment('ready')],
)

export const assignRiderApiDefinition =
  defineJsonPostApi1<OrderId, AssignRiderRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('assign-rider')],
  )

export const pickupOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [apiSegment, deliverySegment, ordersSegment],
  [routeSegment('pickup')],
)

export const deliverOrderApiDefinition = defineJsonPostApi1<OrderId, void, DeliveryAppState>(
  [apiSegment, deliverySegment, ordersSegment],
  [routeSegment('deliver')],
)

export const reviewOrderApiDefinition =
  defineJsonPostApi1<OrderId, ReviewOrderRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('review')],
  )

export const appendStoreReviewReplyApiDefinition =
  defineJsonPostApi1<OrderId, AppendStoreReviewReplyRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('store-review-reply')],
  )

export const sendOrderChatMessageApiDefinition =
  defineJsonPostApi1<OrderId, SendOrderChatMessageRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('chat')],
  )

export const submitPartialRefundRequestApiDefinition =
  defineJsonPostApi1<OrderId, SubmitPartialRefundRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('partial-refunds')],
  )

export const submitAfterSalesRequestApiDefinition =
  defineJsonPostApi1<OrderId, SubmitAfterSalesRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('afterSales')],
  )

export const submitReviewAppealApiDefinition =
  defineJsonPostApi1<OrderId, ReviewAppealRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('review-appeals')],
  )

export const resolveTicketApiDefinition =
  defineJsonPostApi1<OrderId, ResolveTicketRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ordersSegment],
    [routeSegment('resolve')],
  )

export const resolvePartialRefundRequestApiDefinition =
  defineJsonPostApi1<RefundRequestId, ResolvePartialRefundRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, partialRefundsSegment],
    [routeSegment('review')],
  )

export const resolveAfterSalesTicketApiDefinition =
  defineJsonPostApi1<TicketId, ResolveAfterSalesRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, ticketsSegment],
    [routeSegment('afterSales'), routeSegment('review')],
  )

export const removeMenuItemApiDefinition =
  defineJsonPostApi2<StoreId, MenuItemId, void, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('menu')],
    [routeSegment('remove')],
  )

export const updateMenuItemStockApiDefinition =
  defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemStockRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('menu')],
    [routeSegment('stock')],
  )

export const updateMenuItemPriceApiDefinition =
  defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemPriceRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('menu')],
    [routeSegment('price')],
  )

export const updateMenuItemCategoryApiDefinition =
  defineJsonPostApi2<StoreId, MenuItemId, UpdateMenuItemCategoryRequest, DeliveryAppState>(
    [apiSegment, deliverySegment, storesSegment],
    [routeSegment('menu')],
    [routeSegment('category')],
  )
