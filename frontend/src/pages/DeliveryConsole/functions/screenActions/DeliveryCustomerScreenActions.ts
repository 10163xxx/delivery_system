import type { NavigateFunction } from 'react-router-dom'
import { createCustomerActions } from '@/pages/DeliveryConsole/functions/customer/CustomerActions'
import type {
  CustomerActionContexts,
  CustomerOrderIssueParams,
  CustomerOrderParams,
  CustomerProfileParams,
  CustomerRechargeParams,
  CustomerSearchParams,
} from '@/pages/CustomerConsole/objects/CustomerActionObjects'
import type {
  DeliveryConsolePageState as PageState,
  DeliveryConsolePageViewState as PageViewState,
  DeliveryConsoleSessionState as SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryConsoleScreenObjects'

function getCustomerSearchContext(
  pageView: PageViewState,
  pageState: PageState,
  sessionState: SessionState,
): CustomerSearchParams {
  return {
    activeCustomerId: pageView.activeCustomerId,
    customerStoreSearchDraft: pageState.store.customerStoreSearchDraft,
    favoriteStoreIds: sessionState.favoriteStoreIds,
    blockedStoreIds: sessionState.blockedStoreIds,
    setCustomerStoreSearchDraft: pageState.store.setCustomerStoreSearchDraft,
    setCustomerStoreSearch: pageState.store.setCustomerStoreSearch,
    setCustomerStoreSearchHistory: sessionState.setCustomerStoreSearchHistory,
    setFavoriteStoreIds: sessionState.setFavoriteStoreIds,
    setBlockedStoreIds: sessionState.setBlockedStoreIds,
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
    customRechargeAmount: pageState.recharge.customRechargeAmount,
    selectedRechargeAmount: pageState.recharge.selectedRechargeAmount,
    runAction: sessionState.runAction,
    navigate,
    setCustomRechargeAmount: pageState.recharge.setCustomRechargeAmount,
    setSelectedRechargeAmount: pageState.recharge.setSelectedRechargeAmount,
    setRechargeFieldError: pageState.recharge.setRechargeFieldError,
  }
}

function getCustomerProfileContext(
  pageView: PageViewState,
  pageState: PageState,
  sessionState: SessionState,
): CustomerProfileParams {
  return {
    selectedCustomer: pageView.selectedCustomer,
    customerNameDraft: pageState.profile.customerNameDraft,
    addressDraft: pageState.profile.addressDraft,
    runAction: sessionState.runAction,
    setError: sessionState.setError,
    setAddressFormErrors: pageState.profile.setAddressFormErrors,
    setAddressDraft: pageState.profile.setAddressDraft,
    setSession: sessionState.setSession,
  }
}

function getCustomerOrderIssueContext(
  pageState: PageState,
  sessionState: SessionState,
  navigate: NavigateFunction,
): CustomerOrderIssueParams {
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
    selection: {
      selectedStore: pageView.selectedStore,
      selectedStoreIsOpen: pageView.selectedStoreIsOpen,
      selectedCustomer: pageView.selectedCustomer,
      selectedCoupon: pageView.selectedCoupon,
      customerRequiresDefaultAddressUpdate:
        pageView.customerRequiresDefaultAddressUpdate,
      payableTotalCents: pageView.payableTotalCents,
    },
    draft: {
      quantities: pageState.checkout.quantities,
      selectedMenuItemConfigurations: pageState.checkout.selectedMenuItemConfigurations,
      menuItemConfigurationModal: pageState.checkout.menuItemConfigurationModal,
      deliveryAddress: pageState.checkout.deliveryAddress,
      scheduledDeliveryTime: pageState.checkout.scheduledDeliveryTime,
      scheduledDeliveryTouched: pageState.checkout.scheduledDeliveryTouched,
      remark: pageState.checkout.remark,
      orderChatDrafts: pageState.orderChatDrafts,
    },
    actions: {
      runAction: sessionState.runAction,
      navigate,
      setDeliveryAddressError: pageState.checkout.setDeliveryAddressError,
      setScheduledDeliveryError: pageState.checkout.setScheduledDeliveryError,
      setScheduledDeliveryTime: pageState.checkout.setScheduledDeliveryTime,
      setScheduledDeliveryTouched: pageState.checkout.setScheduledDeliveryTouched,
      setRemark: pageState.checkout.setRemark,
      setQuantities: pageState.checkout.setQuantities,
      setSelectedMenuItemConfigurations: pageState.checkout.setSelectedMenuItemConfigurations,
      setMenuItemConfigurationModal: pageState.checkout.setMenuItemConfigurationModal,
      setIsCheckoutExpanded: pageState.checkout.setIsCheckoutExpanded,
      setSelectedCouponId: pageState.checkout.setSelectedCouponId,
      setSelectedStoreCategory: pageState.setSelectedStoreCategory,
      setSelectedStoreId: pageState.setSelectedStoreId,
      setError: sessionState.setError,
      setOrderChatErrors: pageState.setOrderChatErrors,
      setOrderChatDrafts: pageState.setOrderChatDrafts,
    },
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
    search: getCustomerSearchContext(pageView, pageState, sessionState),
    recharge: getCustomerRechargeContext(
      pageView,
      pageState,
      sessionState,
      navigate,
    ),
    profile: getCustomerProfileContext(pageView, pageState, sessionState),
    orderIssue: getCustomerOrderIssueContext(pageState, sessionState, navigate),
    order: getCustomerOrderContext(pageView, pageState, sessionState, navigate),
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
