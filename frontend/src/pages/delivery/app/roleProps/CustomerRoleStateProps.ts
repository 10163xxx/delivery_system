import type {
  PageState,
  SessionService,
} from '@/objects/page/AppBuildRolePropsObjects'

function getCustomerDraftStateProps(pageState: PageState) {
  return {
    addressDraft: pageState.addressDraft,
    customerNameDraft: pageState.customerNameDraft,
    customerStoreSearchDraft: pageState.customerStoreSearchDraft,
    customRechargeAmount: pageState.customRechargeAmount,
    reviewDrafts: pageState.reviewDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    partialRefundDrafts: pageState.partialRefundDrafts,
  }
}

function getCustomerFormStateProps(pageState: PageState) {
  return {
    addressFormErrors: pageState.addressFormErrors,
    deliveryAddressError: pageState.deliveryAddressError,
    reviewErrors: pageState.reviewErrors,
    scheduledDeliveryError: pageState.scheduledDeliveryError,
    afterSalesErrors: pageState.afterSalesErrors,
    orderChatErrors: pageState.orderChatErrors,
    partialRefundErrors: pageState.partialRefundErrors,
  }
}

function getCustomerMutableStateProps(
  pageState: PageState,
  sessionService: SessionService,
) {
  return {
    customerStoreSearch: pageState.customerStoreSearch,
    customerStoreSearchHistory: sessionService.customerStoreSearchHistory,
    favoriteStoreIds: sessionService.favoriteStoreIds,
    blockedStoreIds: sessionService.blockedStoreIds,
    customerStoreVisibility: pageState.customerStoreVisibility,
    selectedStoreCategory: pageState.selectedStoreCategory,
    deliveryAddress: pageState.deliveryAddress,
    isCheckoutExpanded: pageState.isCheckoutExpanded,
    quantities: pageState.quantities,
    selectedMenuItemConfigurations: pageState.selectedMenuItemConfigurations,
    menuItemConfigurationModal: pageState.menuItemConfigurationModal,
    remark: pageState.remark,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
    selectedCouponId: pageState.selectedCouponId,
    selectedRechargeAmount: pageState.selectedRechargeAmount,
    stateTickets: sessionService.state?.tickets ?? [],
  }
}

function getCustomerSetterProps(pageState: PageState, sessionService: SessionService) {
  return {
    setAddressDraft: pageState.setAddressDraft,
    setCustomerNameDraft: pageState.setCustomerNameDraft,
    setCustomRechargeAmount: pageState.setCustomRechargeAmount,
    setRemark: pageState.setRemark,
    setReviewDrafts: pageState.setReviewDrafts,
    setAfterSalesDrafts: pageState.setAfterSalesDrafts,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setPartialRefundDrafts: pageState.setPartialRefundDrafts,
    setAddressFormErrors: pageState.setAddressFormErrors,
    setDeliveryAddressError: pageState.setDeliveryAddressError,
    setError: sessionService.setError,
    setReviewErrors: pageState.setReviewErrors,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setAfterSalesErrors: pageState.setAfterSalesErrors,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setPartialRefundErrors: pageState.setPartialRefundErrors,
    setDeliveryAddress: pageState.setDeliveryAddress,
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setMenuItemConfigurationModal: pageState.setMenuItemConfigurationModal,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
    setSelectedCouponId: pageState.setSelectedCouponId,
    setSelectedMenuItemConfigurations: pageState.setSelectedMenuItemConfigurations,
    setSelectedRechargeAmount: pageState.setSelectedRechargeAmount,
    setCustomerStoreSearch: pageState.setCustomerStoreSearch,
    setCustomerStoreSearchDraft: pageState.setCustomerStoreSearchDraft,
    setCustomerStoreVisibility: pageState.setCustomerStoreVisibility,
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
    ...getCustomerMutableStateProps(pageState, sessionService),
    ...getCustomerSetterProps(pageState, sessionService),
  }
}
