import type { MenuItem } from '@/shared/object/core/SharedObjects'
import type { ReviewDraft, MerchantApplicationView } from '@/shared/object/core/DeliveryAppObjects'
import {
  changeMerchantApplicationViewAction,
  chooseStoreCategoryAction,
  enterMerchantStoreAction,
  enterStoreAction,
  leaveMerchantStoreAction,
  leaveStoreAction,
  openCheckoutAction,
  resetStoreCategoryAction,
  updateQuantityAction,
  updateReviewDraftAction,
} from '@/shared/app/delivery/DeliveryPageViewActions'
import {
  getPageActionCheckoutSetters,
  getPageActionReviewSetters,
  getPageActionSelectionSetters,
  getPageViewAnalyticsDataProps,
  getPageViewCustomerStateDataProps,
  getPageViewDerivedDataProps,
  getPageViewFormattingConstants,
  getPageViewMerchantStateDataProps,
  getPageViewNoticeDataProps,
  getPageViewOrderDataProps,
  getPageViewPricingConstants,
  getPageViewReviewConstants,
  getPageViewRuntimeDataProps,
  getPageViewStoreConstants,
  getPageViewSupportDataProps,
  getPageViewSupportStateDataProps,
  getPageViewWorkspaceDataProps,
} from '@/shared/app/delivery/DeliveryPageViewGroups'
import type {
  PageActionArgsInput,
  PageViewActionInput,
  PageViewDataInput,
} from '@/shared/object/core/DeliveryPageViewPropObjects'

export function buildPageActionArgs(input: PageActionArgsInput) {
  return {
    state: input.state,
    selectedStore: input.selectedStore,
    selectedCustomer: input.selectedCustomer,
    selectedStoreIsOpen: input.selectedStoreIsOpen,
    quantities: input.quantities,
    scheduledDeliveryTime: input.scheduledDeliveryTime,
    setError: input.setError,
    setSearchParams: input.setSearchParams,
    ...getPageActionSelectionSetters(input.pageState),
    ...getPageActionCheckoutSetters(input.pageState),
    ...getPageActionReviewSetters(input.pageState),
  }
}

export function getPageViewDataProps(input: PageViewDataInput) {
  return {
    ...getPageViewDerivedDataProps(input),
    ...getPageViewWorkspaceDataProps(input.workspaceViews),
    ...getPageViewOrderDataProps(input.derived),
    ...getPageViewSupportDataProps(input.derived),
    ...getPageViewNoticeDataProps(input.derived, input.seenCustomerProfileNoticeIds),
    ...getPageViewAnalyticsDataProps(input.derived),
    ...getPageViewRuntimeDataProps(input),
    ...getPageViewCustomerStateDataProps(input.pageState),
    ...getPageViewMerchantStateDataProps(input.pageState),
    ...getPageViewSupportStateDataProps(input.pageState),
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
    ...getPageViewPricingConstants(),
    ...getPageViewReviewConstants(),
    ...getPageViewFormattingConstants(),
    ...getPageViewStoreConstants(),
  }
}
