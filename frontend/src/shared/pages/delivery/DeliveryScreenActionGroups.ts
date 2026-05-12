import type { NavigateFunction } from 'react-router-dom'
import { createCustomerActions } from '@/customer/app/actions/CustomerActions'
import { createMerchantActions } from '@/merchant/app/actions/MerchantActions'
import type {
  CustomerActionContexts,
  CustomerOrderParams,
  CustomerProfileParams,
  CustomerRechargeParams,
  CustomerSearchParams,
  CustomerSupportParams,
} from '@/customer/object/action/CustomerActionObjects'
import type {
  DeliveryConsolePageState as PageState,
  DeliveryConsolePageViewState as PageViewState,
  DeliveryConsoleSessionState as SessionState,
} from '@/shared/object/core/DeliveryConsoleScreenObjects'

export function getScreenSessionActions(sessionState: SessionState) {
  return {
    loadState: sessionState.loadState,
    logout: sessionState.logout,
    runAction: sessionState.runAction,
    setCustomerStoreSearchHistory: sessionState.setCustomerStoreSearchHistory,
    setError: sessionState.setError,
    setSession: sessionState.setSession,
  }
}

export function getScreenSessionDisplayState(sessionState: SessionState) {
  return {
    busy: sessionState.busy,
    customerStoreSearchHistory: sessionState.customerStoreSearchHistory,
    error: sessionState.error,
    headerAction: sessionState.headerAction,
    session: sessionState.session,
    showLogoutModal: sessionState.showLogoutModal,
    state: sessionState.state,
  }
}

function getCustomerSearchContext(
  pageState: PageState,
  sessionState: SessionState,
): CustomerSearchParams {
  return {
    customerStoreSearchDraft: pageState.customerStoreSearchDraft,
    setCustomerStoreSearchDraft: pageState.setCustomerStoreSearchDraft,
    setCustomerStoreSearch: pageState.setCustomerStoreSearch,
    setCustomerStoreSearchHistory: sessionState.setCustomerStoreSearchHistory,
  }
}

function getCustomerRechargeContext(
  pageView: PageViewState,
  pageState: PageState,
  sessionState: SessionState,
  navigate: NavigateFunction,
): CustomerRechargeParams {
  return {
    selectedCustomer: pageView.selectedCustomer,
    customRechargeAmount: pageState.customRechargeAmount,
    runAction: sessionState.runAction,
    navigate,
    setCustomRechargeAmount: pageState.setCustomRechargeAmount,
    setSelectedRechargeAmount: pageState.setSelectedRechargeAmount,
    setRechargeFieldError: pageState.setRechargeFieldError,
  }
}

function getCustomerProfileContext(
  pageView: PageViewState,
  pageState: PageState,
  sessionState: SessionState,
): CustomerProfileParams {
  return {
    selectedCustomer: pageView.selectedCustomer,
    customerNameDraft: pageState.customerNameDraft,
    addressDraft: pageState.addressDraft,
    runAction: sessionState.runAction,
    setError: sessionState.setError,
    setAddressFormErrors: pageState.setAddressFormErrors,
    setAddressDraft: pageState.setAddressDraft,
    setSession: sessionState.setSession,
  }
}

function getCustomerSupportContext(
  pageState: PageState,
  sessionState: SessionState,
  navigate: NavigateFunction,
): CustomerSupportParams {
  return {
    state: sessionState.state,
    partialRefundDrafts: pageState.partialRefundDrafts,
    afterSalesDrafts: pageState.afterSalesDrafts,
    reviewDrafts: pageState.reviewDrafts,
    runAction: sessionState.runAction,
    navigate,
    setPartialRefundErrors: pageState.setPartialRefundErrors,
    setPartialRefundDrafts: pageState.setPartialRefundDrafts,
    setAfterSalesErrors: pageState.setAfterSalesErrors,
    setAfterSalesDrafts: pageState.setAfterSalesDrafts,
    setReviewErrors: pageState.setReviewErrors,
    setReviewDrafts: pageState.setReviewDrafts,
  }
}

function getCustomerOrderContext(
  pageView: PageViewState,
  pageState: PageState,
  sessionState: SessionState,
  navigate: NavigateFunction,
): CustomerOrderParams {
  return {
    selectedStore: pageView.selectedStore,
    selectedStoreIsOpen: pageView.selectedStoreIsOpen,
    selectedCustomer: pageView.selectedCustomer,
    selectedCoupon: pageView.selectedCoupon,
    customerRequiresDefaultAddressUpdate:
      pageView.customerRequiresDefaultAddressUpdate,
    quantities: pageState.quantities,
    deliveryAddress: pageState.deliveryAddress,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
    scheduledDeliveryTouched: pageState.scheduledDeliveryTouched,
    remark: pageState.remark,
    payableTotalCents: pageView.payableTotalCents,
    orderChatDrafts: pageState.orderChatDrafts,
    runAction: sessionState.runAction,
    navigate,
    setDeliveryAddressError: pageState.setDeliveryAddressError,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
    setRemark: pageState.setRemark,
    setQuantities: pageState.setQuantities,
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setSelectedCouponId: pageState.setSelectedCouponId,
    setError: sessionState.setError,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
  }
}

function getCustomerActionContexts(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: NavigateFunction
}): CustomerActionContexts {
  const { pageView, pageState, sessionState, navigate } = args

  return {
    search: getCustomerSearchContext(pageState, sessionState),
    recharge: getCustomerRechargeContext(
      pageView,
      pageState,
      sessionState,
      navigate,
    ),
    profile: getCustomerProfileContext(pageView, pageState, sessionState),
    support: getCustomerSupportContext(pageState, sessionState, navigate),
    order: getCustomerOrderContext(pageView, pageState, sessionState, navigate),
  }
}

function getMerchantProfileContext(pageView: PageViewState, pageState: PageState) {
  return {
    merchantProfile: pageView.merchantProfile,
    merchantProfileDraft: pageState.merchantProfileDraft,
    setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
  }
}

function getMerchantWithdrawContext(pageView: PageViewState, pageState: PageState) {
  return {
    merchantProfile: pageView.merchantProfile,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
  }
}

function getMerchantSupportContext(pageState: PageState) {
  return {
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
  }
}

export function getMerchantDraftContext(
  pageView: PageViewState,
  pageState: PageState,
) {
  return {
    ...getMerchantDraftDisplayContext(pageView, pageState),
    ...getMerchantDraftSetterContext(pageState),
  }
}

function getMerchantDraftDisplayContext(pageView: PageViewState, pageState: PageState) {
  return {
    currentDisplayName: pageView.currentDisplayName,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    menuComposerOpen: pageState.menuComposerOpen,
    menuItemDrafts: pageState.menuItemDrafts,
    menuItemImageUploading: pageState.menuItemImageUploading,
    merchantDraft: pageState.merchantDraft,
  }
}

function getMerchantDraftSetterContext(pageState: PageState) {
  return {
    setIsMerchantImageUploading: pageState.setIsMerchantImageUploading,
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMenuItemImageUploading: pageState.setMenuItemImageUploading,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
  }
}

export function getMerchantActionArgs(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  const { pageView, pageState, sessionState } = args
  return {
    draft: getMerchantDraftContext(pageView, pageState),
    profile: getMerchantProfileContext(pageView, pageState),
    runAction: sessionState.runAction,
    setError: sessionState.setError,
    support: getMerchantSupportContext(pageState),
    withdraw: getMerchantWithdrawContext(pageView, pageState),
  }
}

export function createCustomerConsoleActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: NavigateFunction
}) {
  return createCustomerActions(getCustomerActionContexts(args))
}

export function createMerchantConsoleActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  return createMerchantActions(getMerchantActionArgs(args))
}
