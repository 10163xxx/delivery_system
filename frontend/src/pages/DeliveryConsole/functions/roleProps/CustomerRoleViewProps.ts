import type { CustomerPropsArgs, PageView } from '@/pages/DeliveryConsole/objects/AppBuildRolePropsObjects'
import { getSharedFormattingProps } from './SharedFormattingProps'

function getCustomerOrderCollectionViewProps(pageView: PageView) {
  return {
    activeReviewOrder: pageView.activeReviewOrder,
    activeCustomerOrder: pageView.activeCustomerOrder,
    completedCustomerOrders: pageView.completedCustomerOrders,
    customerOrders: pageView.customerOrders,
    pendingCustomerReviewOrders: pageView.pendingCustomerReviewOrders,
    statusLabels: pageView.statusLabels,
    canReviewOrder: pageView.canReviewOrder,
    getRemainingReviewDays: pageView.getRemainingReviewDays,
    stores: pageView.stores,
  }
}

function getCustomerReviewViewProps(pageView: PageView) {
  return {
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
  }
}

function getCustomerStoreCollectionViewProps(pageView: PageView) {
  return {
    categoryStores: pageView.categoryStores,
    favoriteStores: pageView.favoriteStores,
    blockedStores: pageView.blockedStores,
    monthlyOrdersByStore: pageView.monthlyOrdersByStore,
    monthlySalesByMenuItem: pageView.monthlySalesByMenuItem,
    recentFrequentStores: pageView.recentFrequentStores,
    storeCategories: pageView.storeCategories,
    storeBrowseHighlights: pageView.storeBrowseHighlights,
    storeCustomerReviews: pageView.storeCustomerReviews,
    visibleStores: pageView.visibleStores,
  }
}

function getCustomerSelectedStoreViewProps(pageView: PageView) {
  return {
    isStoreCurrentlyOpen: pageView.isStoreCurrentlyOpen,
    selectedStore: pageView.selectedStore,
    selectedStoreCanOrder: pageView.selectedStoreCanOrder,
    selectedStoreHasMenu: pageView.selectedStoreHasMenu,
  }
}

function getCustomerCheckoutPricingViewProps(pageView: PageView) {
  return {
    availableCheckoutCoupons: pageView.availableCheckoutCoupons,
    cartSubtotal: pageView.cartSubtotal,
    cartTotal: pageView.cartTotal,
    couponDiscountCents: pageView.couponDiscountCents,
    customerRequiresDefaultAddressUpdate:
      pageView.customerRequiresDefaultAddressUpdate,
    deliveryFeeCents: pageView.deliveryFeeCents,
    payableTotalCents: pageView.payableTotalCents,
    remainingBalanceAfterCheckout: pageView.remainingBalanceAfterCheckout,
    selectedCoupon: pageView.selectedCoupon,
    selectedCustomer: pageView.selectedCustomer,
    selectedStoreDeliveryDistanceKm: pageView.selectedStoreDeliveryDistanceKm,
    selectedStoreDeliveryDistanceLabel: pageView.selectedStoreDeliveryDistanceLabel,
    selectedStoreDistanceCategory: pageView.selectedStoreDistanceCategory,
    selectedStoreIsDeliverable: pageView.selectedStoreIsDeliverable,
  }
}

function getCustomerRechargeViewProps(pageView: PageView) {
  return {
    parsedRechargeAmount: pageView.parsedRechargeAmount,
    rechargeAmountError: pageView.rechargeAmountError,
    rechargeAmountPreview: pageView.rechargeAmountPreview,
    RECHARGE_PRESET_AMOUNTS: pageView.RECHARGE_PRESET_AMOUNTS,
  }
}

function getCustomerMenuActionViewProps(pageView: PageView) {
  return {
    suggestedDeliveryTime: pageView.todayDeliveryWindow.minimumValue,
    todayDeliveryCutoff: pageView.todayDeliveryWindow.cutoffValue,
    addPreviousOrderToCart: pageView.addPreviousOrderToCart,
    closeMenuItemConfiguration: pageView.closeMenuItemConfiguration,
    confirmMenuItemConfiguration: pageView.confirmMenuItemConfiguration,
    openMenuItemConfiguration: pageView.openMenuItemConfiguration,
    openCheckout: pageView.openCheckout,
    repeatOrder: pageView.repeatOrder,
    updateCartLineQuantity: pageView.updateCartLineQuantity,
    updateQuantity: pageView.updateQuantity,
  }
}

export function getCustomerViewProps(
  pageView: PageView,
  navigate: CustomerPropsArgs['navigate'],
) {
  return {
    ...getCustomerOrderCollectionViewProps(pageView),
    ...getCustomerReviewViewProps(pageView),
    ...getCustomerStoreViewProps(pageView, navigate),
    ...getCustomerStoreCollectionViewProps(pageView),
    ...getCustomerSelectedStoreViewProps(pageView),
    ...getCustomerCheckoutPricingViewProps(pageView),
    ...getCustomerRechargeViewProps(pageView),
    ...getCustomerMenuActionViewProps(pageView),
    customerProfileNoticeCount: pageView.unreadCustomerProfileNoticeCount,
    selectedCustomer: pageView.selectedCustomer,
    activeCustomerId: pageView.activeCustomerId,
    ...getSharedFormattingProps(pageView),
  }
}
