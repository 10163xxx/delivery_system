// Converts page state, derived data, and action handlers into role-view props.
import type { MenuItem, StoreId } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { ReviewDraft } from '@/pages/DeliveryConsole/objects/DeliveryDraftObjects'
import type { MerchantApplicationView } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
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
  updateCartLineQuantityAction,
  updateQuantityAction,
  updateReviewDraftAction,
} from '@/pages/DeliveryConsole/functions/DeliveryPageViewActions'
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
  getPageViewTicketDataProps,
  getPageViewTicketStateDataProps,
  getPageViewWorkspaceDataProps,
} from '@/pages/DeliveryConsole/functions/DeliveryPageViewGroups'
import type {
  PageActionArgsInput,
  PageViewActionInput,
  PageViewDataInput,
} from '@/pages/DeliveryConsole/objects/DeliveryPageViewPropObjects'

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
    ...getPageViewTicketDataProps(input.derived),
    ...getPageViewNoticeDataProps(input.derived, input.seenCustomerProfileNoticeIds),
    ...getPageViewAnalyticsDataProps(input.derived),
    ...getPageViewRuntimeDataProps(input),
    ...getPageViewCustomerStateDataProps(input.pageState),
    ...getPageViewMerchantStateDataProps(input.pageState),
    ...getPageViewTicketStateDataProps(input.pageState),
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
    enterStore: (storeId: string) => enterStoreAction(actionArgs, asDomainText<StoreId>(storeId)),
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
    updateCartLineQuantity: (menuItem: MenuItem, lineKey: string, nextValue: number) =>
      updateCartLineQuantityAction(actionArgs, menuItem, lineKey, nextValue),
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
    addPreviousOrderToCart: (order: import('@/objects/core/SharedObjects').OrderSummary) =>
      addPreviousOrderToCartAction(actionArgs, order, todayDeliveryWindow),
    repeatOrder: (order: import('@/objects/core/SharedObjects').OrderSummary) =>
      repeatCustomerOrderAction(actionArgs, order, todayDeliveryWindow),
  }
}
