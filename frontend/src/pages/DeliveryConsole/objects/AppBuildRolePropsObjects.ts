import type { createCustomerActions } from '@/pages/DeliveryConsole/functions/customer/CustomerActions'
import type { createMerchantActions } from '@/pages/DeliveryConsole/functions/merchant/MerchantActions'
import type { useDeliveryConsolePageState } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageState'
import type { useDeliveryConsolePageViewService } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageView'
import type { useDeliveryConsoleSessionService } from '@/pages/AuthScreen/hooks/AuthSessionService'

export type PageView = ReturnType<typeof useDeliveryConsolePageViewService>
export type PageState = ReturnType<typeof useDeliveryConsolePageState>
export type SessionService = ReturnType<typeof useDeliveryConsoleSessionService>
export type CustomerActions = ReturnType<typeof createCustomerActions>
export type MerchantActions = ReturnType<typeof createMerchantActions>

export type Navigate = ReturnType<typeof import('react-router-dom').useNavigate>

type RolePropsBaseArgs = {
  pageView: PageView
  pageState: PageState
  sessionService: SessionService
  navigate: Navigate
}

type CustomerAddressActionArgs = {
  addCustomerAddress: CustomerActions['addCustomerAddress']
  removeCustomerAddress: CustomerActions['removeCustomerAddress']
  setDefaultCustomerAddress: CustomerActions['setDefaultCustomerAddress']
  saveCustomerName: CustomerActions['saveCustomerName']
  selectRechargeAmount: CustomerActions['selectRechargeAmount']
}

type CustomerSearchAndIssueActionArgs = {
  clearCustomerStoreSearchHistory: CustomerActions['clearCustomerStoreSearchHistory']
  removeCustomerStoreSearchHistoryItem: CustomerActions['removeCustomerStoreSearchHistoryItem']
  toggleBlockedStore: CustomerActions['toggleBlockedStore']
  toggleFavoriteStore: CustomerActions['toggleFavoriteStore']
  submitAfterSalesRequest: CustomerActions['submitAfterSalesRequest']
  submitCustomerStoreSearch: CustomerActions['submitCustomerStoreSearch']
  openRechargePage: CustomerActions['openRechargePage']
}

type CustomerOrderActionArgs = {
  submitOrder: CustomerActions['submitOrder']
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
  submitPartialRefundRequest: CustomerActions['submitPartialRefundRequest']
  submitRechargeFromPage: CustomerActions['submitRechargeFromPage']
  submitReview: CustomerActions['submitReview']
  canSubmitPartialRefund: CustomerActions['canSubmitPartialRefund']
  getRemainingRefundableQuantity: CustomerActions['getRemainingRefundableQuantity']
}

export type CustomerPropsArgs = RolePropsBaseArgs &
  CustomerAddressActionArgs &
  CustomerSearchAndIssueActionArgs &
  CustomerOrderActionArgs

type MerchantMenuActionArgs = {
  getMenuItemDraft: MerchantActions['getMenuItemDraft']
  isMenuComposerExpanded: MerchantActions['isMenuComposerExpanded']
  isMenuItemImageUploading: MerchantActions['isMenuItemImageUploading']
  resolvePartialRefundRequest: MerchantActions['resolvePartialRefundRequest']
  submitStoreMenuItem: MerchantActions['submitStoreMenuItem']
  uploadMerchantImage: MerchantActions['uploadMerchantImage']
  uploadStoreMenuImage: MerchantActions['uploadStoreMenuImage']
}

type MerchantAccountActionArgs = {
  saveMerchantProfile: MerchantActions['saveMerchantProfile']
  submitMerchantApplication: MerchantActions['submitMerchantApplication']
  withdrawMerchantIncome: MerchantActions['withdrawMerchantIncome']
}

export type MerchantActionArgs = MerchantMenuActionArgs & MerchantAccountActionArgs

export type MerchantPropsArgs = RolePropsBaseArgs & {
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
} & MerchantActionArgs

export type RiderPropsArgs = Omit<RolePropsBaseArgs, 'navigate'> & {
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
}

export type AdminPropsArgs = Omit<RolePropsBaseArgs, 'navigate'>
