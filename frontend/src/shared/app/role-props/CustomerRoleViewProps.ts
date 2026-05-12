import type { CustomerPropsArgs, PageView } from '@/shared/object/core/AppBuildRolePropsObjects'
import { getSharedFormattingProps } from './SharedFormattingProps'

function getCustomerOrderViewProps(pageView: PageView) {
  return {
    activeReviewOrder: pageView.activeReviewOrder,
    activeCustomerOrder: pageView.activeCustomerOrder,
    completedCustomerOrders: pageView.completedCustomerOrders,
    customerOrders: pageView.customerOrders,
    pendingCustomerReviewOrders: pageView.pendingCustomerReviewOrders,
    statusLabels: pageView.statusLabels,
    canReviewOrder: pageView.canReviewOrder,
    getRemainingReviewDays: pageView.getRemainingReviewDays,
    hasPendingRiderReview: pageView.hasPendingRiderReview,
    hasPendingStoreReview: pageView.hasPendingStoreReview,
    REVIEW_WINDOW_DAYS: pageView.REVIEW_WINDOW_DAYS,
    RIDER_REVIEW_REASON_OPTIONS: pageView.RIDER_REVIEW_REASON_OPTIONS,
    STORE_REVIEW_REASON_OPTIONS: pageView.STORE_REVIEW_REASON_OPTIONS,
    updateReviewDraft: pageView.updateReviewDraft,
  }
}

function getCustomerStoreViewProps(
  pageView: PageView,
  navigate: CustomerPropsArgs['navigate'],
) {
  return {
    navigate,
    chooseStoreCategory: pageView.chooseStoreCategory,
    customerWorkspaceView: pageView.customerWorkspaceView,
    enterStore: pageView.enterStore,
    leaveStore: pageView.leaveStore,
    resetStoreCategory: pageView.resetStoreCategory,
    categoryStores: pageView.categoryStores,
    monthlyOrdersByStore: pageView.monthlyOrdersByStore,
    monthlySalesByMenuItem: pageView.monthlySalesByMenuItem,
    storeCategories: pageView.storeCategories,
    storeCustomerReviews: pageView.storeCustomerReviews,
    visibleStores: pageView.visibleStores,
    isStoreCurrentlyOpen: pageView.isStoreCurrentlyOpen,
    selectedStore: pageView.selectedStore,
    selectedStoreCanOrder: pageView.selectedStoreCanOrder,
    selectedStoreHasMenu: pageView.selectedStoreHasMenu,
  }
}

function getCustomerCheckoutViewProps(pageView: PageView) {
  return {
    availableCheckoutCoupons: pageView.availableCheckoutCoupons,
    cartSubtotal: pageView.cartSubtotal,
    cartTotal: pageView.cartTotal,
    couponDiscountCents: pageView.couponDiscountCents,
    customerRequiresDefaultAddressUpdate:
      pageView.customerRequiresDefaultAddressUpdate,
    payableTotalCents: pageView.payableTotalCents,
    remainingBalanceAfterCheckout: pageView.remainingBalanceAfterCheckout,
    selectedCoupon: pageView.selectedCoupon,
    selectedCustomer: pageView.selectedCustomer,
    DELIVERY_FEE_CENTS: pageView.DELIVERY_FEE_CENTS,
    parsedRechargeAmount: pageView.parsedRechargeAmount,
    rechargeAmountError: pageView.rechargeAmountError,
    rechargeAmountPreview: pageView.rechargeAmountPreview,
    RECHARGE_PRESET_AMOUNTS: pageView.RECHARGE_PRESET_AMOUNTS,
    suggestedDeliveryTime: pageView.todayDeliveryWindow.minimumValue,
    todayDeliveryCutoff: pageView.todayDeliveryWindow.cutoffValue,
    openCheckout: pageView.openCheckout,
    updateQuantity: pageView.updateQuantity,
  }
}

export function getCustomerViewProps(
  pageView: PageView,
  navigate: CustomerPropsArgs['navigate'],
) {
  return {
    ...getCustomerOrderViewProps(pageView),
    ...getCustomerStoreViewProps(pageView, navigate),
    ...getCustomerCheckoutViewProps(pageView),
    customerProfileNoticeCount: pageView.unreadCustomerProfileNoticeCount,
    selectedCustomer: pageView.selectedCustomer,
    ...getSharedFormattingProps(pageView),
  }
}
