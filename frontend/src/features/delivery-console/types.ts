import type {
  MerchantPayoutAccountType,
  ResolveTicketRequest,
  StoreCategory,
} from '@/domain'

export type ReviewDraft = {
  rating: number
  comment: string
  extraNote: string
}

export type MerchantDraft = {
  merchantName: string
  storeName: string
  category: StoreCategory | ''
  openTime: string
  closeTime: string
  avgPrepMinutes: number
  imageUrl: string
  uploadedImageName: string
  note: string
}

export type AppealResolutionDraft = {
  approved: boolean
  resolutionNote: string
}

export type MenuItemDraft = {
  name: string
  description: string
  priceYuan: string
  remainingQuantity: string
  imageUrl: string
  uploadedImageName: string
}

export type PartialRefundDraft = {
  quantity: number
  reason: string
}

export type AfterSalesDraft = {
  requestType: 'ReturnRequest' | 'CompensationRequest'
  reason: string
  expectedCompensationYuan: string
}

export type AfterSalesResolutionDraft = {
  approved: boolean
  resolutionNote: string
  resolutionMode: 'Balance' | 'Coupon' | 'Manual'
  actualCompensationYuan: string
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
  contactPhone: string
  payoutAccountType: MerchantPayoutAccountType
  bankName: string
  accountNumber: string
  accountHolder: string
}

export type MerchantProfileFormField =
  | 'contactPhone'
  | 'bankName'
  | 'accountNumber'
  | 'accountHolder'

export type CustomerAddressDraft = {
  label: string
  address: string
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
