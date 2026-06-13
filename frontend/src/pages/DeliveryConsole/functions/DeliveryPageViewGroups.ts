import { RECHARGE_PRESET_AMOUNTS, REVIEW_WINDOW_DAYS, RIDER_REVIEW_REASON_OPTIONS, roleLabels, statusLabels, STORE_CATEGORIES, STORE_REVIEW_REASON_OPTIONS } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { canReviewOrder, formatAggregateRating, getRemainingReviewDays, hasPendingRiderReview, hasPendingStoreReview } from '@/pages/DeliveryConsole/functions/review/DeliveryReview'
import { formatBusinessHours, isStoreCurrentlyOpen } from '@/pages/DeliveryConsole/functions/schedule/DeliverySchedule'
import { formatPrice, formatStoreAvailability, formatStoreStatus, formatTime, getCategoryMeta } from '@/pages/DeliveryConsole/functions/shared/DeliveryFormatters'
import type { PageActionArgsInput, PageViewDataInput } from '@/pages/DeliveryConsole/objects/DeliveryPageViewPropObjects'

export function getPageActionSelectionSetters(pageState: PageActionArgsInput['pageState']) {
  return {
    setMerchantApplicationState: pageState.setMerchantApplicationState,
    setQuantities: pageState.checkout.setQuantities,
    setSelectedMenuItemConfigurations: pageState.checkout.setSelectedMenuItemConfigurations,
    setSelectedStoreCategory: pageState.setSelectedStoreCategory,
    setSelectedMerchantStoreId: pageState.setSelectedMerchantStoreId,
    setSelectedStoreId: pageState.setSelectedStoreId,
  }
}

export function getPageActionCheckoutSetters(pageState: PageActionArgsInput['pageState']) {
  return {
    setIsCheckoutExpanded: pageState.checkout.setIsCheckoutExpanded,
    setMenuItemConfigurationModal: pageState.checkout.setMenuItemConfigurationModal,
    setRemark: pageState.checkout.setRemark,
    setScheduledDeliveryError: pageState.checkout.setScheduledDeliveryError,
    setScheduledDeliveryTime: pageState.checkout.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.checkout.setScheduledDeliveryTouched,
    setSelectedCouponId: pageState.checkout.setSelectedCouponId,
  }
}

export function getPageActionReviewSetters(pageState: PageActionArgsInput['pageState']) {
  return {
    setReviewDrafts: pageState.setReviewDrafts,
    setReviewErrors: pageState.setReviewErrors,
  }
}

export function getPageViewDerivedDataProps(
  input: Pick<PageViewDataInput, 'role' | 'derived' | 'currentDisplayName'>,
) {
  const { role, derived, currentDisplayName } = input

  return {
    role,
    activeCustomerId: derived.activeCustomerId,
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    merchantStores: derived.merchantStores,
    merchantProfile: derived.merchantProfile,
    selectedRider: derived.selectedRider,
    currentDisplayName,
    stores: derived.state?.stores ?? [],
  }
}

export function getPageViewWorkspaceDataProps(workspaceViews: PageViewDataInput['workspaceViews']) {
  return {
    customerWorkspaceView: workspaceViews.customerWorkspaceView,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
    merchantApplicationView: workspaceViews.merchantApplicationView,
  }
}

export function getPageViewOrderDataProps(derived: PageViewDataInput['derived']) {
  return {
    riderOrders: derived.riderOrders,
    riderAvailableOrders: derived.riderAvailableOrders,
    riderHistoryOrders: derived.riderHistoryOrders,
    customerOrders: derived.customerOrders,
    completedCustomerOrders: derived.completedCustomerOrders,
    pendingCustomerReviewOrders: derived.pendingCustomerReviewOrders,
    activeCustomerOrder: derived.activeCustomerOrder,
    activeReviewOrder: derived.activeReviewOrder,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
  }
}

export function getPageViewTicketDataProps(derived: PageViewDataInput['derived']) {
  return {
    pendingApplications: derived.pendingApplications,
    merchantPendingApplications: derived.merchantPendingApplications,
    merchantReviewedApplications: derived.merchantReviewedApplications,
    pendingAppeals: derived.pendingAppeals,
    pendingEligibilityReviews: derived.pendingEligibilityReviews,
    afterSalesTickets: derived.afterSalesTickets,
  }
}

export function getPageViewNoticeDataProps(
  derived: PageViewDataInput['derived'],
  seenCustomerProfileNoticeIds: string[],
) {
  const unreadCustomerProfileNoticeCount = derived.customerProfileNoticeIds.filter(
    (noticeId) => !seenCustomerProfileNoticeIds.includes(noticeId),
  ).length

  return {
    customerProfileNoticeCount: derived.customerProfileNoticeCount,
    unreadCustomerProfileNoticeCount,
    customerProfileNoticeIds: derived.customerProfileNoticeIds,
    customerRequiresDefaultAddressUpdate: derived.customerRequiresDefaultAddressUpdate,
  }
}

export function getPageViewAnalyticsDataProps(derived: PageViewDataInput['derived']) {
  return {
    monthlySalesByMenuItem: derived.monthlySalesByMenuItem,
    monthlyOrdersByStore: derived.monthlyOrdersByStore,
    merchantMonthlyTrend: derived.merchantMonthlyTrend,
    recentFrequentStores: derived.recentFrequentStores,
    favoriteStores: derived.favoriteStores,
    blockedStores: derived.blockedStores,
    storeBrowseHighlights: derived.storeBrowseHighlights,
    visibleStores: derived.visibleStores,
    storeCustomerReviews: derived.storeCustomerReviews,
    storeCategories: derived.storeCategories,
    categoryStores: derived.categoryStores,
  }
}

export function getPageViewCustomerStateDataProps(pageState: PageViewDataInput['pageState']) {
  return {
    deliveryAddress: pageState.checkout.deliveryAddress,
    isCheckoutExpanded: pageState.checkout.isCheckoutExpanded,
    menuItemConfigurationModal: pageState.checkout.menuItemConfigurationModal,
    selectedCouponId: pageState.checkout.selectedCouponId,
    selectedMenuItemConfigurations: pageState.checkout.selectedMenuItemConfigurations,
    customerNameDraft: pageState.profile.customerNameDraft,
    customerStoreSearch: pageState.store.customerStoreSearch,
    scheduledDeliveryTime: pageState.checkout.scheduledDeliveryTime,
  }
}

export function getPageViewMerchantStateDataProps(pageState: PageViewDataInput['pageState']) {
  return {
    merchantProfileDraft: pageState.merchantProfileDraft,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    merchantDraft: pageState.merchantDraft,
    merchantFormErrors: pageState.merchantFormErrors,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    menuItemFormErrors: pageState.menuItemFormErrors,
    merchantAppealDrafts: pageState.merchantAppealDrafts,
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    merchantProfileFormErrors: pageState.merchantProfileFormErrors,
  }
}

export function getPageViewTicketStateDataProps(pageState: PageViewDataInput['pageState']) {
  return {
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    reviewDrafts: pageState.reviewDrafts,
    reviewErrors: pageState.reviewErrors,
    partialRefundDrafts: pageState.partialRefundDrafts,
    partialRefundErrors: pageState.partialRefundErrors,
    afterSalesDrafts: pageState.afterSalesDrafts,
    afterSalesErrors: pageState.afterSalesErrors,
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    applicationReviewDrafts: pageState.applicationReviewDrafts,
    afterSalesResolutionDrafts: pageState.afterSalesResolutionDrafts,
    resolutionDrafts: pageState.resolutionDrafts,
    riderAppealDrafts: pageState.riderAppealDrafts,
    appealResolutionDrafts: pageState.appealResolutionDrafts,
    eligibilityResolutionDrafts: pageState.eligibilityResolutionDrafts,
  }
}

export function getPageViewRuntimeDataProps(input: PageViewDataInput) {
  return {
    canReviewOrder,
    ...input.paymentFieldState,
    ...input.checkoutSummary,
    todayDeliveryWindow: input.todayDeliveryWindow,
    customerStoreSearchHistory: input.customerStoreSearchHistory,
    favoriteStoreIds: input.derived.favoriteStoreIds,
    blockedStoreIds: input.derived.blockedStoreIds,
  }
}

export function getPageViewPricingConstants() {
  return {
    BANK_OPTIONS: [],
    RECHARGE_PRESET_AMOUNTS,
  }
}

export function getPageViewReviewConstants() {
  return {
    REVIEW_WINDOW_DAYS,
    RIDER_REVIEW_REASON_OPTIONS,
    STORE_REVIEW_REASON_OPTIONS,
    getRemainingReviewDays,
    hasPendingRiderReview,
    hasPendingStoreReview,
  }
}

export function getPageViewFormattingConstants() {
  return {
    roleLabels,
    statusLabels,
    formatAggregateRating,
    formatBusinessHours,
    formatPrice,
    formatStoreAvailability,
    formatStoreStatus,
    formatTime,
  }
}

export function getPageViewStoreConstants() {
  return {
    STORE_CATEGORIES,
    getCategoryMeta,
    isStoreCurrentlyOpen,
  }
}
