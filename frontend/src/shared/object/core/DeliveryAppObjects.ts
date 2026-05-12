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
  DescriptionText,
  DisplayText,
  EmptySelection,
  ImageUrl,
  Minutes,
  NoteText,
  PersonName,
  PhoneNumber,
  Quantity,
  RatingValue,
  ReasonText,
  ResolveTicketRequest,
  ResolutionText,
  StoreCategory,
  TimeOfDay,
} from '@/shared/object/core/SharedObjects'

export type ReviewDraft = {
  rating: RatingValue
  comment: ReasonText
  extraNote: NoteText
}

export type MerchantDraft = {
  merchantName: PersonName
  storeName: DisplayText
  category: StoreCategory | EmptySelection
  openTime: TimeOfDay
  closeTime: TimeOfDay
  avgPrepMinutes: Minutes
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
  note: NoteText
}

export type AppealResolutionDraft = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

export type MenuItemDraft = {
  name: DisplayText
  description: DescriptionText
  priceYuan: DisplayText
  remainingQuantity: DisplayText
  imageUrl: ImageUrl
  uploadedImageName: DisplayText
}

export type PartialRefundDraft = {
  quantity: Quantity
  reason: ReasonText
}

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

export const CUSTOMER_WORKSPACE_VIEW = {
  order: 'order',
  orders: 'orders',
  orderDetail: 'order-detail',
  profile: 'profile',
  review: 'review',
  recharge: 'recharge',
  addresses: 'addresses',
  coupons: 'coupons',
} as const

export type CustomerWorkspaceView =
  (typeof CUSTOMER_WORKSPACE_VIEW)[keyof typeof CUSTOMER_WORKSPACE_VIEW]

export const CUSTOMER_PROFILE_WORKSPACE_VIEWS = [
  CUSTOMER_WORKSPACE_VIEW.profile,
  CUSTOMER_WORKSPACE_VIEW.recharge,
  CUSTOMER_WORKSPACE_VIEW.coupons,
  CUSTOMER_WORKSPACE_VIEW.addresses,
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
  description: 'description',
  priceYuan: 'priceYuan',
  remainingQuantity: 'remainingQuantity',
  imageUrl: 'imageUrl',
} as const

export type MenuItemFormField =
  (typeof MENU_ITEM_FORM_FIELD)[keyof typeof MENU_ITEM_FORM_FIELD]

export const HEADER_ACTION = {
  refresh: 'refresh',
  logout: 'logout',
} as const

export type HeaderAction = (typeof HEADER_ACTION)[keyof typeof HEADER_ACTION] | null

export type ResolutionDraftMap = Record<string, ResolveTicketRequest>
