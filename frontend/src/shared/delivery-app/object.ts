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
} from '@/shared/object'

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

export type CustomerWorkspaceView =
  | 'order'
  | 'orders'
  | 'order-detail'
  | 'profile'
  | 'review'
  | 'recharge'
  | 'addresses'
  | 'coupons'

export type MerchantWorkspaceView = 'application' | 'console' | 'profile'
export type MerchantApplicationView = 'pending' | 'reviewed' | 'submit'

export type MerchantProfileDraft = {
  contactPhone: PhoneNumber
  payoutAccountType: MerchantPayoutAccountType
  bankName: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}

export type MerchantProfileFormField =
  | 'contactPhone'
  | 'bankName'
  | 'accountNumber'
  | 'accountHolder'

export type CustomerAddressDraft = {
  label: AddressLabel
  address: AddressText
}

export type CustomerAddressField = 'label' | 'address'

export type MerchantFormField =
  | 'merchantName'
  | 'storeName'
  | 'category'
  | 'openTime'
  | 'closeTime'
  | 'imageUrl'

export type MenuItemFormField =
  | 'name'
  | 'description'
  | 'priceYuan'
  | 'remainingQuantity'
  | 'imageUrl'

export type HeaderAction = 'refresh' | 'logout' | null

export type ResolutionDraftMap = Record<string, ResolveTicketRequest>
