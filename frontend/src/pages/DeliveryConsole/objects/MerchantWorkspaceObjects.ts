import type {
  AccountHolderName,
  AccountNumber,
  BankName,
  DisplayText,
  EntityCount,
  MenuItem,
  MerchantPayoutAccountType,
  PhoneNumber,
  StoreId,
} from '@/objects/core/SharedObjects'
import { ROUTE_PATH, ROUTE_QUERY_KEY } from '@/objects/core/SharedObjects'
import type { RoutePathValue } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export const MERCHANT_WORKSPACE_VIEW = {
  application: 'application',
  store: 'store',
  orders: 'orders',
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

export const MERCHANT_FORM_FIELD = {
  merchantName: 'merchantName',
  storeName: 'storeName',
  category: 'category',
  storeAddress: 'storeAddress',
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

export type MerchantRoutePath =
  | typeof ROUTE_PATH.merchantApplication
  | typeof ROUTE_PATH.merchantApplicationSubmit
  | typeof ROUTE_PATH.merchantStore
  | typeof ROUTE_PATH.merchantOrders
  | typeof ROUTE_PATH.merchantConsole
  | typeof ROUTE_PATH.merchantProfile
  | typeof ROUTE_PATH.merchantProfileAnalytics

export function buildMerchantApplicationSubmitRoute(): typeof ROUTE_PATH.merchantApplicationSubmit {
  return `${ROUTE_PATH.merchantApplication}?${ROUTE_QUERY_KEY.merchantView}=${MERCHANT_APPLICATION_VIEW.submit}`
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
