import type { MenuItem, Role } from '@/shared/object/SharedObjects'
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
import type { ReviewDraft } from '@/shared/delivery-app/DeliveryAppObjects'
import {
  changeMerchantApplicationViewAction,
  chooseStoreCategoryAction,
  enterMerchantStoreAction,
  enterStoreAction,
  getTodayDeliveryWindowAction,
  leaveMerchantStoreAction,
  leaveStoreAction,
  openCheckoutAction,
  resetStoreCategoryAction,
  updateQuantityAction,
  updateReviewDraftAction,
} from '@/shared/delivery-app/DeliveryPageViewActions'
import { getDeliveryConsolePageViewDerived } from '@/shared/delivery-app/DeliveryPageViewDerived'
import type { MerchantApplicationView } from '@/shared/delivery-app/DeliveryAppObjects'
import type { Params } from '@/shared/delivery-app/DeliveryPageViewTypes'
import { getWorkspaceViews } from '@/shared/delivery-app/DeliveryPageViewWorkspace'

type PageActionArgsInput = {
  state: Params['sessionService']['state']
  selectedStore: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedStore']
  selectedCustomer: ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']
  selectedStoreIsOpen: boolean
  quantities: Record<string, number>
  scheduledDeliveryTime: string
  pageState: Params['pageState']
  setError: Params['sessionService']['setError']
  setSearchParams: Params['setSearchParams']
}

type PageViewDataInput = {
  role: Role
  workspaceViews: ReturnType<typeof getWorkspaceViews>
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>
  currentDisplayName: string
  pageState: Params['pageState']
  paymentFieldState: {
    parsedRechargeAmount: number | null
    rechargeAmountError: string | null
    rechargeAmountPreview: number | null
    merchantWithdrawError: string | null
  }
  checkoutSummary: {
    cartSubtotal: number
    cartTotal: number
    availableCheckoutCoupons: NonNullable<ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']>['coupons']
    selectedCoupon: NonNullable<ReturnType<typeof getDeliveryConsolePageViewDerived>['selectedCustomer']>['coupons'][number] | null
    couponDiscountCents: number
    payableTotalCents: number
    selectedStoreHasMenu: boolean
    selectedStoreCanOrder: boolean
    remainingBalanceAfterCheckout: number | null
  }
  todayDeliveryWindow: ReturnType<typeof getTodayDeliveryWindowAction>
  customerStoreSearchHistory: string[]
}

type PageViewActionInput = {
  actionArgs: ReturnType<typeof buildPageActionArgs>
  todayDeliveryWindow: ReturnType<typeof getTodayDeliveryWindowAction>
  setMerchantWorkspaceState: Params['pageState']['setMerchantWorkspaceState']
  setMerchantApplicationState: Params['pageState']['setMerchantApplicationState']
}

export function buildPageActionArgs(input: PageActionArgsInput) {
  const {
    state,
    selectedStore,
    selectedCustomer,
    selectedStoreIsOpen,
    quantities,
    scheduledDeliveryTime,
    pageState,
    setError,
    setSearchParams,
  } = input
  return {
    state,
    selectedStore,
    selectedCustomer,
    selectedStoreIsOpen,
    quantities,
    scheduledDeliveryTime,
    setSelectedStoreCategory: pageState.setSelectedStoreCategory,
    setSelectedStoreId: pageState.setSelectedStoreId,
    setQuantities: pageState.setQuantities,
    setError,
    setSearchParams,
    setMerchantApplicationState: pageState.setMerchantApplicationState,
    setSelectedMerchantStoreId: pageState.setSelectedMerchantStoreId,
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
    setReviewDrafts: pageState.setReviewDrafts,
    setReviewErrors: pageState.setReviewErrors,
  }
}

export function getPageViewDataProps(input: PageViewDataInput) {
  const {
    role,
    workspaceViews,
    derived,
    currentDisplayName,
    pageState,
    paymentFieldState,
    checkoutSummary,
    todayDeliveryWindow,
    customerStoreSearchHistory,
  } = input
  return {
    role,
    customerWorkspaceView: workspaceViews.customerWorkspaceView,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
    merchantApplicationView: workspaceViews.merchantApplicationView,
    activeCustomerId: derived.activeCustomerId,
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    merchantStores: derived.merchantStores,
    merchantProfile: derived.merchantProfile,
    selectedRider: derived.selectedRider,
    riderOrders: derived.riderOrders,
    customerOrders: derived.customerOrders,
    completedCustomerOrders: derived.completedCustomerOrders,
    pendingCustomerReviewOrders: derived.pendingCustomerReviewOrders,
    activeCustomerOrder: derived.activeCustomerOrder,
    activeReviewOrder: derived.activeReviewOrder,
    pendingApplications: derived.pendingApplications,
    merchantPendingApplications: derived.merchantPendingApplications,
    merchantReviewedApplications: derived.merchantReviewedApplications,
    pendingAppeals: derived.pendingAppeals,
    pendingEligibilityReviews: derived.pendingEligibilityReviews,
    afterSalesTickets: derived.afterSalesTickets,
    visibleStores: derived.visibleStores,
    storeCustomerReviews: derived.storeCustomerReviews,
    storeCategories: derived.storeCategories,
    categoryStores: derived.categoryStores,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    currentDisplayName,
    canReviewOrder,
    ...paymentFieldState,
    ...checkoutSummary,
    todayDeliveryWindow,
    customerStoreSearchHistory,
    deliveryAddress: pageState.deliveryAddress,
    isCheckoutExpanded: pageState.isCheckoutExpanded,
    selectedCouponId: pageState.selectedCouponId,
    customerNameDraft: pageState.customerNameDraft,
    merchantProfileDraft: pageState.merchantProfileDraft,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    orderChatDrafts: pageState.orderChatDrafts,
    orderChatErrors: pageState.orderChatErrors,
    reviewDrafts: pageState.reviewDrafts,
    reviewErrors: pageState.reviewErrors,
    partialRefundDrafts: pageState.partialRefundDrafts,
    partialRefundErrors: pageState.partialRefundErrors,
    afterSalesDrafts: pageState.afterSalesDrafts,
    afterSalesErrors: pageState.afterSalesErrors,
    partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
    merchantDraft: pageState.merchantDraft,
    merchantFormErrors: pageState.merchantFormErrors,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    menuItemFormErrors: pageState.menuItemFormErrors,
    applicationReviewDrafts: pageState.applicationReviewDrafts,
    afterSalesResolutionDrafts: pageState.afterSalesResolutionDrafts,
    resolutionDrafts: pageState.resolutionDrafts,
    merchantAppealDrafts: pageState.merchantAppealDrafts,
    riderAppealDrafts: pageState.riderAppealDrafts,
    appealResolutionDrafts: pageState.appealResolutionDrafts,
    eligibilityReviewDrafts: pageState.eligibilityReviewDrafts,
    eligibilityResolutionDrafts: pageState.eligibilityResolutionDrafts,
    merchantProfileFormErrors: pageState.merchantProfileFormErrors,
    customerStoreSearch: pageState.customerStoreSearch,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
  }
}

export function getPageViewActionProps(input: PageViewActionInput) {
  const {
    actionArgs,
    todayDeliveryWindow,
    setMerchantWorkspaceState,
    setMerchantApplicationState,
  } = input
  return {
    setMerchantWorkspaceViewState: setMerchantWorkspaceState,
    setMerchantApplicationViewState: setMerchantApplicationState,
    openCheckout: () => openCheckoutAction(actionArgs, todayDeliveryWindow),
    updateReviewDraft: (orderId: string, patch: Partial<ReviewDraft>) =>
      updateReviewDraftAction(actionArgs, orderId, patch),
    chooseStoreCategory: (category: string) => chooseStoreCategoryAction(actionArgs, category),
    resetStoreCategory: () => resetStoreCategoryAction(actionArgs),
    enterStore: (storeId: string) => enterStoreAction(actionArgs, storeId),
    leaveStore: () => leaveStoreAction(actionArgs),
    changeMerchantApplicationView: (view: MerchantApplicationView) =>
      changeMerchantApplicationViewAction(actionArgs, view),
    leaveMerchantStore: () => leaveMerchantStoreAction(actionArgs),
    enterMerchantStore: (storeId: string) => enterMerchantStoreAction(actionArgs, storeId),
    updateQuantity: (menuItem: MenuItem, nextValue: number) =>
      updateQuantityAction(actionArgs, menuItem, nextValue),
  }
}

export function getPageViewConstantProps() {
  return {
    RECHARGE_PRESET_AMOUNTS,
    REVIEW_WINDOW_DAYS,
    RIDER_REVIEW_REASON_OPTIONS,
    STORE_REVIEW_REASON_OPTIONS,
    BANK_OPTIONS: [],
    DELIVERY_FEE_CENTS,
    roleLabels,
    statusLabels,
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
    STORE_CATEGORIES,
  }
}
