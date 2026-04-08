import type { MenuItem } from '@/domain'
import {
  CURRENCY_CENTS_SCALE,
  DELIVERY_FEE_CENTS,
  MAX_RECHARGE_AMOUNT_YUAN,
  MAX_WITHDRAW_AMOUNT_YUAN,
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
  parseMerchantWithdrawAmount,
  parseRechargeAmount,
  DELIVERY_CONSOLE_MESSAGES,
} from '@/features/delivery-console'
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
} from './page-view-service.actions'
import { getDeliveryConsolePageViewDerived } from './page-view-service.derived'
import { useDeliveryConsolePageViewEffects } from './page-view-service.effects'
import { getCustomerWorkspaceView, getMerchantApplicationViewFromUrl, getMerchantWorkspaceViewFromUrl } from './page-view-service.route'
import type { Params } from './page-view-service.types'

export function useDeliveryConsolePageViewService(params: Params) {
  const {
    locationPathname,
    navigate,
    routeOrderId,
    searchParams,
    setSearchParams,
    sessionService,
    pageState,
  } = params
  const { session, state, setError, customerStoreSearchHistory, setCustomerStoreSearchHistory } =
    sessionService
  const {
    selectedCustomerId,
    selectedStoreCategory,
    setSelectedStoreCategory,
    selectedStoreId,
    setSelectedStoreId,
    selectedMerchantStoreId,
    setSelectedMerchantStoreId,
    selectedRiderId,
    merchantWorkspaceState,
    setMerchantWorkspaceState,
    merchantApplicationState,
    setMerchantApplicationState,
    customerStoreSearch,
    deliveryAddress,
    scheduledDeliveryTime,
    setScheduledDeliveryError,
    setScheduledDeliveryTime,
    setScheduledDeliveryTouched,
    setQuantities,
    quantities,
    isCheckoutExpanded,
    setIsCheckoutExpanded,
    selectedCouponId,
    customerNameDraft,
    customRechargeAmount,
    selectedRechargeAmount,
    merchantProfileDraft,
    merchantWithdrawAmount,
    merchantWithdrawFieldError,
    rechargeFieldError,
    orderChatDrafts,
    orderChatErrors,
    reviewDrafts,
    setReviewDrafts,
    reviewErrors,
    setReviewErrors,
    partialRefundDrafts,
    partialRefundErrors,
    afterSalesDrafts,
    afterSalesErrors,
    partialRefundResolutionDrafts,
    merchantDraft,
    merchantFormErrors,
    isMerchantImageUploading,
    menuItemFormErrors,
    applicationReviewDrafts,
    afterSalesResolutionDrafts,
    resolutionDrafts,
    merchantAppealDrafts,
    riderAppealDrafts,
    appealResolutionDrafts,
    eligibilityReviewDrafts,
    eligibilityResolutionDrafts,
    merchantProfileFormErrors,
  } = pageState

  const role = session?.user.role ?? 'customer'
  const customerWorkspaceView = getCustomerWorkspaceView(locationPathname)
  const merchantWorkspaceViewFromUrl = getMerchantWorkspaceViewFromUrl(locationPathname)
  const merchantApplicationViewFromUrl = getMerchantApplicationViewFromUrl(searchParams)
  const merchantWorkspaceView = merchantWorkspaceState || merchantWorkspaceViewFromUrl
  const merchantApplicationView = merchantApplicationState || merchantApplicationViewFromUrl

  const derived = getDeliveryConsolePageViewDerived({
    routeOrderId,
    sessionService,
    selectedCustomerId,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    selectedRiderId,
    customerStoreSearch,
    merchantWorkspaceView,
  })

  useDeliveryConsolePageViewEffects({
    locationPathname,
    navigate,
    searchParams,
    sessionService: {
      session,
      state,
      setError,
      customerStoreSearchHistory,
      setCustomerStoreSearchHistory,
    },
    pageState,
    customerWorkspaceView,
    merchantWorkspaceView,
    merchantWorkspaceViewFromUrl,
    merchantApplicationViewFromUrl,
    activeCustomerOrder: derived.activeCustomerOrder,
    activeReviewOrder: derived.activeReviewOrder,
    selectedCustomer: derived.selectedCustomer,
    selectedStore: derived.selectedStore,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    merchantStores: derived.merchantStores,
    selectedRiderId,
    merchantProfile: derived.merchantProfile,
    quantities,
    selectedCouponId,
  })

  const currentDisplayName =
    session?.user.role === 'customer'
      ? (derived.selectedCustomer?.name ?? session.user.displayName)
      : session?.user.displayName ?? ''
  const actionArgs = {
    state,
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    quantities,
    scheduledDeliveryTime,
    setSelectedStoreCategory,
    setSelectedStoreId,
    setQuantities,
    setError,
    setSearchParams,
    setMerchantApplicationState,
    setSelectedMerchantStoreId,
    setIsCheckoutExpanded,
    setScheduledDeliveryTime,
    setScheduledDeliveryError,
    setScheduledDeliveryTouched,
    setReviewDrafts,
    setReviewErrors,
  }
  const todayDeliveryWindow = getTodayDeliveryWindowAction()

  const parsedRechargeAmount = parseRechargeAmount(customRechargeAmount)
  const rechargeAmountError =
    parsedRechargeAmount !== null && parsedRechargeAmount > MAX_RECHARGE_AMOUNT_YUAN
      ? DELIVERY_CONSOLE_MESSAGES.rechargeAmountTooLarge
      : rechargeFieldError
  const rechargeAmountPreview = parsedRechargeAmount ?? selectedRechargeAmount
  const parsedMerchantWithdrawAmount = parseMerchantWithdrawAmount(merchantWithdrawAmount)
  const merchantWithdrawError =
    parsedMerchantWithdrawAmount !== null &&
    parsedMerchantWithdrawAmount > MAX_WITHDRAW_AMOUNT_YUAN
      ? DELIVERY_CONSOLE_MESSAGES.withdrawAmountTooLarge
      : parsedMerchantWithdrawAmount !== null &&
          derived.merchantProfile != null &&
          Math.round(parsedMerchantWithdrawAmount * CURRENCY_CENTS_SCALE) >
            derived.merchantProfile.availableToWithdrawCents
        ? DELIVERY_CONSOLE_MESSAGES.withdrawExceedsAvailableBalance
        : merchantWithdrawFieldError

  const cartSubtotal = derived.selectedStore
    ? derived.selectedStore.menu.reduce(
        (sum: number, item: MenuItem) => sum + item.priceCents * (quantities[item.id] ?? 0),
        0,
      )
    : 0
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + DELIVERY_FEE_CENTS : 0
  const availableCheckoutCoupons =
    derived.selectedCustomer?.coupons.filter((coupon) => cartSubtotal >= coupon.minimumSpendCents) ?? []
  const selectedCoupon =
    availableCheckoutCoupons.find((coupon) => coupon.id === selectedCouponId) ?? null
  const couponDiscountCents =
    cartTotal > 0 && selectedCoupon ? Math.min(selectedCoupon.discountCents, cartTotal) : 0
  const payableTotalCents = Math.max(0, cartTotal - couponDiscountCents)
  const selectedStoreHasMenu = Boolean(
    derived.selectedStore &&
      derived.selectedStore.menu.some(
        (item: MenuItem) => item.remainingQuantity == null || item.remainingQuantity > 0,
      ),
  )
  const selectedStoreCanOrder = Boolean(
    derived.selectedStore && selectedStoreHasMenu && derived.selectedStoreIsOpen,
  )
  const remainingBalanceAfterCheckout =
    derived.selectedCustomer && payableTotalCents > 0
      ? derived.selectedCustomer.balanceCents - payableTotalCents
      : null

  return {
    role,
    customerWorkspaceView,
    merchantWorkspaceView,
    merchantApplicationView,
    setMerchantWorkspaceViewState: setMerchantWorkspaceState,
    setMerchantApplicationViewState: setMerchantApplicationState,
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
    storeCategories: derived.storeCategories,
    categoryStores: derived.categoryStores,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    currentDisplayName,
    canReviewOrder,
    parsedRechargeAmount,
    rechargeAmountError,
    rechargeAmountPreview,
    merchantWithdrawError,
    cartSubtotal,
    cartTotal,
    availableCheckoutCoupons,
    selectedCoupon,
    couponDiscountCents,
    payableTotalCents,
    selectedStoreHasMenu,
    selectedStoreCanOrder,
    remainingBalanceAfterCheckout,
    todayDeliveryWindow,
    customerStoreSearchHistory,
    deliveryAddress,
    isCheckoutExpanded,
    selectedCouponId,
    customerNameDraft,
    merchantProfileDraft,
    merchantWithdrawAmount,
    orderChatDrafts,
    orderChatErrors,
    reviewDrafts,
    reviewErrors,
    partialRefundDrafts,
    partialRefundErrors,
    afterSalesDrafts,
    afterSalesErrors,
    partialRefundResolutionDrafts,
    merchantDraft,
    merchantFormErrors,
    isMerchantImageUploading,
    menuItemFormErrors,
    applicationReviewDrafts,
    afterSalesResolutionDrafts,
    resolutionDrafts,
    merchantAppealDrafts,
    riderAppealDrafts,
    appealResolutionDrafts,
    eligibilityReviewDrafts,
    eligibilityResolutionDrafts,
    merchantProfileFormErrors,
    customerStoreSearch,
    scheduledDeliveryTime,
    openCheckout: () => openCheckoutAction(actionArgs, todayDeliveryWindow),
    updateReviewDraft: (orderId: string, patch: any) => updateReviewDraftAction(actionArgs, orderId, patch),
    chooseStoreCategory: (category: string) => chooseStoreCategoryAction(actionArgs, category),
    resetStoreCategory: () => resetStoreCategoryAction(actionArgs),
    enterStore: (storeId: string) => enterStoreAction(actionArgs, storeId),
    leaveStore: () => leaveStoreAction(actionArgs),
    changeMerchantApplicationView: (view: any) => changeMerchantApplicationViewAction(actionArgs, view),
    leaveMerchantStore: () => leaveMerchantStoreAction(actionArgs),
    enterMerchantStore: (storeId: string) => enterMerchantStoreAction(actionArgs, storeId),
    updateQuantity: (menuItem: MenuItem, nextValue: number) => updateQuantityAction(actionArgs, menuItem, nextValue),
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
