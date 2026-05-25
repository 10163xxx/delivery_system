import type { MenuItem } from '@/shared/object/core/SharedObjects'
import type { ReviewDraft, MerchantApplicationView } from '@/shared/object/core/DeliveryAppObjects'
import {
  changeMerchantApplicationViewAction,
  chooseStoreCategoryAction,
  closeMenuItemConfigurationAction,
  confirmMenuItemConfigurationAction,
  enterMerchantStoreAction,
  enterStoreAction,
  leaveMerchantStoreAction,
  leaveStoreAction,
  addPreviousOrderToCartAction,
  openMenuItemConfigurationAction,
  openCheckoutAction,
  repeatCustomerOrderAction,
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
    selectedMenuItemConfigurations: input.selectedMenuItemConfigurations,
    scheduledDeliveryTime: input.scheduledDeliveryTime,
    setError: input.setError,
    navigate: input.navigate,
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
    ...getPageViewRoutingActionProps(actionArgs, setMerchantWorkspaceState, setMerchantApplicationState),
    ...getPageViewReviewActionProps(actionArgs),
    ...getPageViewMerchantActionProps(actionArgs),
    ...getPageViewMenuActionProps(actionArgs, todayDeliveryWindow),
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

function getPageViewRoutingActionProps(
  actionArgs: ReturnType<typeof buildPageActionArgs>,
  setMerchantWorkspaceState: PageViewActionInput['setMerchantWorkspaceState'],
  setMerchantApplicationState: PageViewActionInput['setMerchantApplicationState'],
) {
  return {
    setMerchantWorkspaceViewState: setMerchantWorkspaceState,
    setMerchantApplicationViewState: setMerchantApplicationState,
    chooseStoreCategory: (category: string) => chooseStoreCategoryAction(actionArgs, category),
    resetStoreCategory: () => resetStoreCategoryAction(actionArgs),
    enterStore: (storeId: string) => enterStoreAction(actionArgs, storeId),
    leaveStore: () => leaveStoreAction(actionArgs),
    changeMerchantApplicationView: (view: MerchantApplicationView) =>
      changeMerchantApplicationViewAction(actionArgs, view),
    leaveMerchantStore: () => leaveMerchantStoreAction(actionArgs),
    enterMerchantStore: (storeId: string) => enterMerchantStoreAction(actionArgs, storeId),
  }
}

function getPageViewReviewActionProps(actionArgs: ReturnType<typeof buildPageActionArgs>) {
  return {
    updateReviewDraft: (orderId: string, patch: Partial<ReviewDraft>) =>
      updateReviewDraftAction(actionArgs, orderId, patch),
  }
}

function getPageViewMerchantActionProps(actionArgs: ReturnType<typeof buildPageActionArgs>) {
  return {
    updateQuantity: (menuItem: MenuItem, nextValue: number) =>
      updateQuantityAction(actionArgs, menuItem, nextValue),
    openMenuItemConfiguration: (menuItem: MenuItem) =>
      openMenuItemConfigurationAction(actionArgs, menuItem),
    confirmMenuItemConfiguration: (
      menuItem: MenuItem,
      quantityAfterConfirm: number,
      selections: Record<string, string[]>,
    ) => confirmMenuItemConfigurationAction(actionArgs, menuItem, quantityAfterConfirm, selections),
    closeMenuItemConfiguration: () => closeMenuItemConfigurationAction(actionArgs),
  }
}

function getPageViewMenuActionProps(
  actionArgs: ReturnType<typeof buildPageActionArgs>,
  todayDeliveryWindow: PageViewActionInput['todayDeliveryWindow'],
) {
  return {
    openCheckout: () => openCheckoutAction(actionArgs, todayDeliveryWindow),
    addPreviousOrderToCart: (order: import('@/shared/object/core/SharedObjects').OrderSummary) =>
      addPreviousOrderToCartAction(actionArgs, order, todayDeliveryWindow),
    repeatOrder: (order: import('@/shared/object/core/SharedObjects').OrderSummary) =>
      repeatCustomerOrderAction(actionArgs, order, todayDeliveryWindow),
  }
}
