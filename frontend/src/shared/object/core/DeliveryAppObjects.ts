import type {
  AccountHolderName,
  AccountNumber,
  AddressLabel,
  AddressText,
  MerchantPayoutAccountType,
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  BankName,
  CustomerId,
  DescriptionText,
  DisplayText,
  EmptySelection,
  EntityCount,
  ImageUrl,
  MenuItem,
  MenuItemId,
  Minutes,
  NoteText,
  OrderId,
  PersonName,
  PhoneNumber,
  Quantity,
  RatingValue,
  ReasonText,
  ResolveTicketRequest,
  ResolutionText,
  StoreId,
  StoreCategory,
  TimeOfDay,
} from '@/shared/object/core/SharedObjects'
import type { MenuItemSelectionGroup, OrderItemSelection } from '@/shared/object/core/SharedObjects'
import { REVIEW_TARGET, ROUTE_PATH, ROUTE_QUERY_KEY } from '@/shared/object/core/SharedObjects'

export type ReviewDraft = {
  rating: RatingValue
  comment: ReasonText
  extraNote: NoteText
}

type MerchantIdentityDraft = {
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory | EmptySelection
}

type MerchantScheduleDraft = {
  openTime: TimeOfDay
  closeTime: TimeOfDay
  avgPrepMinutes: Minutes
}

type MerchantAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  note: NoteText
}

export type MerchantDraft = MerchantIdentityDraft & MerchantScheduleDraft & MerchantAssetDraft

export type AppealResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

type MenuItemContentDraft = {
  name: DisplayText
  category: DisplayText
  description: DescriptionText
}

type MenuItemPricingDraft = {
  priceYuan: DisplayText
  remainingQuantity: DisplayText
}

type MenuItemAssetDraft = {
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  selectionGroupsText: DisplayText
}

export type MenuItemDraft = MenuItemContentDraft & MenuItemPricingDraft & MenuItemAssetDraft

export type SelectedMenuItemConfiguration = {
  selections: OrderItemSelection[]
  summaryText: DisplayText
}

export type MenuItemConfigurationModalState = {
  itemId: MenuItemId
  quantityAfterConfirm: Quantity
  draftSelections: Record<DisplayText, DisplayText[]>
  errorText: DisplayText | null
}

export type ParsedMenuItemSelectionGroups = {
  groups: MenuItemSelectionGroup[]
  errorText: DisplayText | null
}

export type PartialRefundDraft = {
  quantity: Quantity
  reason: ReasonText
}

export type ReviewTargetValue = (typeof REVIEW_TARGET)[keyof typeof REVIEW_TARGET]
export type ReviewDraftKey = `${OrderId}-${ReviewTargetValue}`
export type PartialRefundDraftKey = `${OrderId}-${MenuItemId}`

export type AfterSalesDraft = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationYuan: DisplayText
}

export type AfterSalesResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
  resolutionMode: AfterSalesResolutionMode
  actualCompensationYuan: DisplayText
}

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
] as CustomerWorkspaceView[]

export function isCustomerProfileWorkspaceView(
  view: CustomerWorkspaceView,
): boolean {
  return CUSTOMER_PROFILE_WORKSPACE_VIEWS.includes(view)
}

export const MERCHANT_WORKSPACE_VIEW = {
  application: 'application',
  console: 'console',
  profile: 'profile',
} as const

export type MerchantWorkspaceView =
  (typeof MERCHANT_WORKSPACE_VIEW)[keyof typeof MERCHANT_WORKSPACE_VIEW]

export const MERCHANT_APPLICATION_VIEW = {
  pending: 'pending',
  reviewed: 'reviewed',
  submit: 'submit',
} as const

export type MerchantApplicationView =
  (typeof MERCHANT_APPLICATION_VIEW)[keyof typeof MERCHANT_APPLICATION_VIEW]

export type MerchantProfileDraft = {
  contactPhone: PhoneNumber
  payoutAccountType: MerchantPayoutAccountType
  bankName: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}

export const MERCHANT_PROFILE_FORM_FIELD = {
  contactPhone: 'contactPhone',
  bankName: 'bankName',
  accountNumber: 'accountNumber',
  accountHolder: 'accountHolder',
} as const

export type MerchantProfileFormField =
  (typeof MERCHANT_PROFILE_FORM_FIELD)[keyof typeof MERCHANT_PROFILE_FORM_FIELD]

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

export const MERCHANT_FORM_FIELD = {
  merchantName: 'merchantName',
  storeName: 'storeName',
  category: 'category',
  openTime: 'openTime',
  closeTime: 'closeTime',
  imageUrl: 'imageUrl',
} as const

export type MerchantFormField =
  (typeof MERCHANT_FORM_FIELD)[keyof typeof MERCHANT_FORM_FIELD]

export const MENU_ITEM_FORM_FIELD = {
  name: 'name',
  category: 'category',
  description: 'description',
  priceYuan: 'priceYuan',
  remainingQuantity: 'remainingQuantity',
  imageUrl: 'imageUrl',
  selectionGroupsText: 'selectionGroupsText',
} as const

export type MenuItemFormField =
  (typeof MENU_ITEM_FORM_FIELD)[keyof typeof MENU_ITEM_FORM_FIELD]

export const HEADER_ACTION = {
  refresh: 'refresh',
  logout: 'logout',
} as const

export type HeaderAction = (typeof HEADER_ACTION)[keyof typeof HEADER_ACTION] | null

export const FEEDBACK_TONE = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
} as const

export type FeedbackTone = (typeof FEEDBACK_TONE)[keyof typeof FEEDBACK_TONE]

export const FEEDBACK_PREFIX = {
  [FEEDBACK_TONE.error]: '__error__:',
  [FEEDBACK_TONE.info]: '__info__:',
  [FEEDBACK_TONE.success]: '__success__:',
  [FEEDBACK_TONE.warning]: '__warning__:',
} as const

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

export type MerchantRoutePath =
  | typeof ROUTE_PATH.merchantApplication
  | typeof ROUTE_PATH.merchantApplicationSubmit
  | typeof ROUTE_PATH.merchantConsole
  | typeof ROUTE_PATH.merchantProfile
  | typeof ROUTE_PATH.merchantProfileAnalytics

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

export function buildMerchantApplicationSubmitRoute(): typeof ROUTE_PATH.merchantApplicationSubmit {
  return `${ROUTE_PATH.merchantApplication}?${ROUTE_QUERY_KEY.merchantView}=${MERCHANT_APPLICATION_VIEW.submit}`
}

export function buildReviewDraftKey(
  orderId: OrderId,
  target: ReviewTargetValue,
): ReviewDraftKey {
  return `${orderId}-${target}`
}

export function buildPartialRefundDraftKey(
  orderId: OrderId,
  menuItemId: MenuItemId,
): PartialRefundDraftKey {
  return `${orderId}-${menuItemId}`
}

export type MerchantWorkspaceRouteMeta = {
  title: DisplayText
  path: RoutePathValue
  resetStoreSelection: boolean
}

export type MerchantCategorySectionId = DisplayText

export type MerchantMenuSectionItemCardInfoProps = {
  item: MenuItem
  monthlySales: EntityCount
}

export type MerchantStoreMenuFieldProps = {
  storeId: StoreId
}

export type MerchantStoreMenuImageProps = MerchantStoreMenuFieldProps & {
  storeName: DisplayText
}

export type CustomerStoreQuerySelection = {
  storeId: StoreId
}

export type CustomerAddressOwnerSelection = {
  customerId: CustomerId
}
