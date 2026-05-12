import {
  DELIVERY_FEE_CENTS,
  RECHARGE_PRESET_AMOUNTS,
  REVIEW_WINDOW_DAYS,
  RIDER_REVIEW_REASON_OPTIONS,
  roleLabels,
  statusLabels,
  STORE_CATEGORIES,
  STORE_REVIEW_REASON_OPTIONS,
  canReviewOrder,
  formatAggregateRating,
  formatBusinessHours,
  formatPrice,
  formatStoreAvailability,
  formatStoreStatus,
  formatTime,
  getCategoryMeta,
  getRemainingReviewDays,
  hasPendingRiderReview,
  hasPendingStoreReview,
  isStoreCurrentlyOpen,
} from '@/shared/delivery/DeliveryServices'
import type { PageActionArgsInput, PageViewDataInput } from '@/shared/object/core/DeliveryPageViewPropObjects'

export function getPageActionSelectionSetters(pageState: PageActionArgsInput['pageState']) {
  return {
    setMerchantApplicationState: pageState.setMerchantApplicationState,
    setQuantities: pageState.setQuantities,
    setSelectedStoreCategory: pageState.setSelectedStoreCategory,
    setSelectedMerchantStoreId: pageState.setSelectedMerchantStoreId,
    setSelectedStoreId: pageState.setSelectedStoreId,
  }
}

export function getPageActionCheckoutSetters(pageState: PageActionArgsInput['pageState']) {
  return {
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
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
    customerOrders: derived.customerOrders,
    completedCustomerOrders: derived.completedCustomerOrders,
    pendingCustomerReviewOrders: derived.pendingCustomerReviewOrders,
    activeCustomerOrder: derived.activeCustomerOrder,
    activeReviewOrder: derived.activeReviewOrder,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
  }
}

export function getPageViewSupportDataProps(derived: PageViewDataInput['derived']) {
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
    visibleStores: derived.visibleStores,
    storeCustomerReviews: derived.storeCustomerReviews,
    storeCategories: derived.storeCategories,
    categoryStores: derived.categoryStores,
  }
}

export function getPageViewCustomerStateDataProps(pageState: PageViewDataInput['pageState']) {
  return {
    deliveryAddress: pageState.deliveryAddress,
    isCheckoutExpanded: pageState.isCheckoutExpanded,
    selectedCouponId: pageState.selectedCouponId,
    customerNameDraft: pageState.customerNameDraft,
    customerStoreSearch: pageState.customerStoreSearch,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
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

export function getPageViewSupportStateDataProps(pageState: PageViewDataInput['pageState']) {
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
  }
}

export function getPageViewPricingConstants() {
  return {
    BANK_OPTIONS: [],
    DELIVERY_FEE_CENTS,
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
