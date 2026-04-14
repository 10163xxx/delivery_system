import type { createCustomerActions } from '@/customer/app/actions/customer-actions'
import type { createMerchantActions } from '@/merchant/app/actions/merchant-actions'
import type { useDeliveryConsolePageState } from '@/shared/delivery-app/page-state-service'
import type { useDeliveryConsolePageViewService } from '@/shared/delivery-app/page-view-service'
import type { useDeliveryConsoleSessionService } from '@/shared/delivery-app/session-service'

export type PageView = ReturnType<typeof useDeliveryConsolePageViewService>
export type PageState = ReturnType<typeof useDeliveryConsolePageState>
export type SessionService = ReturnType<typeof useDeliveryConsoleSessionService>
export type CustomerActions = ReturnType<typeof createCustomerActions>
export type MerchantActions = ReturnType<typeof createMerchantActions>

export type Navigate = ReturnType<typeof import('react-router-dom').useNavigate>

export type CustomerPropsArgs = {
  pageView: PageView
  pageState: PageState
  sessionService: SessionService
  navigate: Navigate
  addCustomerAddress: CustomerActions['addCustomerAddress']
  getRemainingRefundableQuantity: CustomerActions['getRemainingRefundableQuantity']
  openRechargePage: CustomerActions['openRechargePage']
  removeCustomerAddress: CustomerActions['removeCustomerAddress']
  setDefaultCustomerAddress: CustomerActions['setDefaultCustomerAddress']
  saveCustomerName: CustomerActions['saveCustomerName']
  selectRechargeAmount: CustomerActions['selectRechargeAmount']
  clearCustomerStoreSearchHistory: CustomerActions['clearCustomerStoreSearchHistory']
  removeCustomerStoreSearchHistoryItem: CustomerActions['removeCustomerStoreSearchHistoryItem']
  submitAfterSalesRequest: CustomerActions['submitAfterSalesRequest']
  submitCustomerStoreSearch: CustomerActions['submitCustomerStoreSearch']
  submitOrder: CustomerActions['submitOrder']
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
  submitPartialRefundRequest: CustomerActions['submitPartialRefundRequest']
  submitRechargeFromPage: CustomerActions['submitRechargeFromPage']
  submitReview: CustomerActions['submitReview']
  canSubmitPartialRefund: CustomerActions['canSubmitPartialRefund']
}

export type MerchantActionArgs = {
  getMenuItemDraft: MerchantActions['getMenuItemDraft']
  isMenuComposerExpanded: MerchantActions['isMenuComposerExpanded']
  isMenuItemImageUploading: MerchantActions['isMenuItemImageUploading']
  resolvePartialRefundRequest: MerchantActions['resolvePartialRefundRequest']
  saveMerchantProfile: MerchantActions['saveMerchantProfile']
  submitMerchantApplication: MerchantActions['submitMerchantApplication']
  submitStoreMenuItem: MerchantActions['submitStoreMenuItem']
  uploadMerchantImage: MerchantActions['uploadMerchantImage']
  uploadStoreMenuImage: MerchantActions['uploadStoreMenuImage']
  withdrawMerchantIncome: MerchantActions['withdrawMerchantIncome']
}

export type MerchantPropsArgs = {
  pageView: PageView
  pageState: PageState
  sessionService: SessionService
  navigate: Navigate
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
} & MerchantActionArgs

export type RiderPropsArgs = {
  pageView: PageView
  pageState: PageState
  sessionService: SessionService
  submitOrderChatMessage: CustomerActions['submitOrderChatMessage']
}

export type AdminPropsArgs = {
  pageView: PageView
  pageState: PageState
  sessionService: SessionService
}
