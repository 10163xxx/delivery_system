import type {
  PageState,
  SessionService,
} from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'

function getCustomerDraftStateProps(pageState: PageState) {
  return {
    addressDraft: pageState.profile.addressDraft,
    customerNameDraft: pageState.profile.customerNameDraft,
    customerStoreSearchDraft: pageState.store.customerStoreSearchDraft,
    customRechargeAmount: pageState.recharge.customRechargeAmount,
    reviewDrafts: pageState.reviewDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    partialRefundDrafts: pageState.partialRefundDrafts,
  }
}

function getCustomerFormStateProps(pageState: PageState) {
  return {
    addressFormErrors: pageState.profile.addressFormErrors,
    deliveryAddressError: pageState.checkout.deliveryAddressError,
    reviewErrors: pageState.reviewErrors,
    scheduledDeliveryError: pageState.checkout.scheduledDeliveryError,
    afterSalesErrors: pageState.afterSalesErrors,
    orderChatErrors: pageState.orderChatErrors,
    partialRefundErrors: pageState.partialRefundErrors,
  }
}

function getCustomerStoreStateProps(
  pageState: PageState,
  sessionService: SessionService,
) {
  return {
    customerStoreSearch: pageState.store.customerStoreSearch,
    customerStoreSearchHistory: sessionService.customerStoreSearchHistory,
    favoriteStoreIds: sessionService.favoriteStoreIds,
    blockedStoreIds: sessionService.blockedStoreIds,
    customerStoreVisibility: pageState.store.customerStoreVisibility,
    selectedStoreCategory: pageState.selectedStoreCategory,
  }
}

function getCustomerCheckoutStateProps(pageState: PageState) {
  return {
    deliveryAddress: pageState.checkout.deliveryAddress,
    isCheckoutExpanded: pageState.checkout.isCheckoutExpanded,
    quantities: pageState.checkout.quantities,
    selectedMenuItemConfigurations: pageState.checkout.selectedMenuItemConfigurations,
    menuItemConfigurationModal: pageState.checkout.menuItemConfigurationModal,
    remark: pageState.checkout.remark,
    scheduledDeliveryTime: pageState.checkout.scheduledDeliveryTime,
    selectedCouponId: pageState.checkout.selectedCouponId,
  }
}

function getCustomerRechargeStateProps(pageState: PageState) {
  return {
    selectedRechargeAmount: pageState.recharge.selectedRechargeAmount,
  }
}

function getCustomerTicketStateProps(sessionService: SessionService) {
  return {
    stateTickets: sessionService.state?.tickets ?? [],
  }
}

function getCustomerDraftSetterProps(pageState: PageState) {
  return {
    setAddressDraft: pageState.profile.setAddressDraft,
    setCustomerNameDraft: pageState.profile.setCustomerNameDraft,
    setCustomRechargeAmount: pageState.recharge.setCustomRechargeAmount,
    setRemark: pageState.checkout.setRemark,
    setReviewDrafts: pageState.setReviewDrafts,
    setAfterSalesDrafts: pageState.setAfterSalesDrafts,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setPartialRefundDrafts: pageState.setPartialRefundDrafts,
  }
}

function getCustomerFormSetterProps(pageState: PageState, sessionService: SessionService) {
  return {
    setAddressFormErrors: pageState.profile.setAddressFormErrors,
    setDeliveryAddressError: pageState.checkout.setDeliveryAddressError,
    setError: sessionService.setError,
    setReviewErrors: pageState.setReviewErrors,
    setScheduledDeliveryError: pageState.checkout.setScheduledDeliveryError,
    setAfterSalesErrors: pageState.setAfterSalesErrors,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setPartialRefundErrors: pageState.setPartialRefundErrors,
  }
}

function getCustomerCheckoutSetterProps(pageState: PageState) {
  return {
    setDeliveryAddress: pageState.checkout.setDeliveryAddress,
    setIsCheckoutExpanded: pageState.checkout.setIsCheckoutExpanded,
    setMenuItemConfigurationModal: pageState.checkout.setMenuItemConfigurationModal,
    setScheduledDeliveryTime: pageState.checkout.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.checkout.setScheduledDeliveryTouched,
    setSelectedCouponId: pageState.checkout.setSelectedCouponId,
    setSelectedMenuItemConfigurations: pageState.checkout.setSelectedMenuItemConfigurations,
    setSelectedRechargeAmount: pageState.recharge.setSelectedRechargeAmount,
  }
}

function getCustomerStoreSetterProps(pageState: PageState, sessionService: SessionService) {
  return {
    setCustomerStoreSearch: pageState.store.setCustomerStoreSearch,
    setCustomerStoreSearchDraft: pageState.store.setCustomerStoreSearchDraft,
    setCustomerStoreVisibility: pageState.store.setCustomerStoreVisibility,
    setFavoriteStoreIds: sessionService.setFavoriteStoreIds,
    setBlockedStoreIds: sessionService.setBlockedStoreIds,
  }
}

export function getCustomerStateProps(
  pageState: PageState,
  sessionService: SessionService,
) {
  return {
    afterSalesDrafts: pageState.afterSalesDrafts,
    ...getCustomerDraftStateProps(pageState),
    ...getCustomerFormStateProps(pageState),
    ...getCustomerStoreStateProps(pageState, sessionService),
    ...getCustomerCheckoutStateProps(pageState),
    ...getCustomerRechargeStateProps(pageState),
    ...getCustomerTicketStateProps(sessionService),
    ...getCustomerDraftSetterProps(pageState),
    ...getCustomerFormSetterProps(pageState, sessionService),
    ...getCustomerCheckoutSetterProps(pageState),
    ...getCustomerStoreSetterProps(pageState, sessionService),
  }
}
