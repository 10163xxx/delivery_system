import { getTodayDeliveryWindowAction } from '@/pages/DeliveryConsole/functions/DeliveryPageViewActions'
import { getDeliveryConsolePageViewDerived } from '@/pages/DeliveryConsole/functions/DeliveryPageViewDerived'
import { useDeliveryConsolePageViewEffects } from '@/pages/DeliveryConsole/hooks/DeliveryConsoleEffects'
import { getCheckoutSummary, getPaymentFieldState } from '@/pages/DeliveryConsole/functions/DeliveryPageViewCheckout'
import {
  buildPageActionArgs,
  getPageViewActionProps,
  getPageViewConstantProps,
  getPageViewDataProps,
} from '@/pages/DeliveryConsole/functions/DeliveryPageViewProps'
import { ROLE, type PersonName } from '@/objects/core/SharedObjects'
import type { DisplayText } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { DeliveryPageViewParams } from '@/pages/DeliveryConsole/objects/DeliveryPageObjects'
import { getWorkspaceViews } from '@/pages/DeliveryConsole/functions/DeliveryPageViewWorkspace'

function getPageViewServiceSession(sessionService: DeliveryPageViewParams['sessionService']) {
  const {
    session,
    state,
    setError,
    customerStoreSearchHistory,
    setCustomerStoreSearchHistory,
    favoriteStoreIds,
    setFavoriteStoreIds,
    blockedStoreIds,
    setBlockedStoreIds,
  } = sessionService

  return {
    session,
    state,
    setError,
    customerStoreSearchHistory,
    setCustomerStoreSearchHistory,
    favoriteStoreIds,
    setFavoriteStoreIds,
    blockedStoreIds,
    setBlockedStoreIds,
  }
}

function getPageViewServiceSelections(
  pageState: DeliveryPageViewParams['pageState'],
  sessionBits: ReturnType<typeof getPageViewServiceSession>,
) {
  return {
    selectedCustomerId: pageState.selectedCustomerId,
    selectedStoreCategory: pageState.selectedStoreCategory,
    selectedStoreId: pageState.selectedStoreId,
    selectedMerchantStoreId: pageState.selectedMerchantStoreId,
    selectedRiderId: pageState.selectedRiderId,
    favoriteStoreIds: sessionBits.favoriteStoreIds,
    blockedStoreIds: sessionBits.blockedStoreIds,
    merchantWorkspaceState: pageState.merchantWorkspaceState,
    merchantApplicationState: pageState.merchantApplicationState,
  }
}

function getPageViewServiceCheckoutState(pageState: DeliveryPageViewParams['pageState']) {
  return {
    customerStoreSearch: pageState.store.customerStoreSearch,
    deliveryAddress: pageState.checkout.deliveryAddress,
    scheduledDeliveryTime: pageState.checkout.scheduledDeliveryTime,
    quantities: pageState.checkout.quantities,
    selectedMenuItemConfigurations: pageState.checkout.selectedMenuItemConfigurations,
    selectedCouponId: pageState.checkout.selectedCouponId,
    customRechargeAmount: pageState.recharge.customRechargeAmount,
    selectedRechargeAmount: pageState.recharge.selectedRechargeAmount,
    merchantWithdrawAmount: pageState.merchantWithdrawAmount,
    merchantWithdrawFieldError: pageState.merchantWithdrawFieldError,
    rechargeFieldError: pageState.recharge.rechargeFieldError,
  }
}

function getCurrentDisplayName(
  session: ReturnType<typeof getPageViewServiceSession>['session'],
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>,
) {
  const name = session?.user.role === ROLE.customer
    ? (derived.selectedCustomer?.name ?? session.user.displayName)
    : session?.user.displayName ?? ''
  return asDomainText<PersonName>(name)
}

function getDerivedPageView(args: {
  routeOrderId: DeliveryPageViewParams['routeOrderId']
  sessionService: DeliveryPageViewParams['sessionService']
  selections: ReturnType<typeof getPageViewServiceSelections>
  customerStoreSearch: DisplayText
  merchantWorkspaceView: ReturnType<typeof getWorkspaceViews>['merchantWorkspaceView']
}) {
  const {
    routeOrderId,
    sessionService,
    selections,
    customerStoreSearch,
    merchantWorkspaceView,
  } = args

  return getDeliveryConsolePageViewDerived({
    routeOrderId,
    sessionService,
    selectedCustomerId: selections.selectedCustomerId,
    selectedStoreCategory: selections.selectedStoreCategory,
    selectedStoreId: selections.selectedStoreId,
    selectedMerchantStoreId: selections.selectedMerchantStoreId,
    selectedRiderId: selections.selectedRiderId,
    customerStoreSearch,
    favoriteStoreIds: selections.favoriteStoreIds,
    blockedStoreIds: selections.blockedStoreIds,
    merchantWorkspaceView,
  })
}

function runPageViewEffects(args: {
  params: DeliveryPageViewParams
  sessionBits: ReturnType<typeof getPageViewServiceSession>
  workspaceViews: ReturnType<typeof getWorkspaceViews>
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>
  selections: ReturnType<typeof getPageViewServiceSelections>
  checkoutState: ReturnType<typeof getPageViewServiceCheckoutState>
}) {
  const { params, sessionBits, workspaceViews, derived, selections, checkoutState } = args

  useDeliveryConsolePageViewEffects({
    locationPathname: params.locationPathname,
    navigate: params.navigate,
    searchParams: params.searchParams,
    sessionService: sessionBits,
    pageState: params.pageState,
    customerWorkspaceView: workspaceViews.customerWorkspaceView,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
    merchantWorkspaceViewFromUrl: workspaceViews.merchantWorkspaceViewFromUrl,
    merchantApplicationViewFromUrl: workspaceViews.merchantApplicationViewFromUrl,
    activeCustomerOrder: derived.activeCustomerOrder,
    activeReviewOrder: derived.activeReviewOrder,
    selectedCustomer: derived.selectedCustomer,
    selectedStore: derived.selectedStore,
    selectedStoreCategory: selections.selectedStoreCategory,
    selectedStoreId: selections.selectedStoreId,
    selectedMerchantStoreId: selections.selectedMerchantStoreId,
    merchantStores: derived.merchantStores,
    selectedRiderId: selections.selectedRiderId,
    merchantProfile: derived.merchantProfile,
    quantities: checkoutState.quantities,
    selectedMenuItemConfigurations: checkoutState.selectedMenuItemConfigurations,
    selectedCouponId: checkoutState.selectedCouponId,
    customerProfileNoticeIds: derived.customerProfileNoticeIds,
  })
}

function getPageViewComputedState(args: {
  params: DeliveryPageViewParams
  sessionBits: ReturnType<typeof getPageViewServiceSession>
  derived: ReturnType<typeof getDeliveryConsolePageViewDerived>
  checkoutState: ReturnType<typeof getPageViewServiceCheckoutState>
}) {
  const { params, sessionBits, derived, checkoutState } = args
  const todayDeliveryWindow = getTodayDeliveryWindowAction()
  const actionArgs = buildPageActionArgs({
    state: sessionBits.state,
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    quantities: checkoutState.quantities,
    selectedMenuItemConfigurations: checkoutState.selectedMenuItemConfigurations,
    scheduledDeliveryTime: checkoutState.scheduledDeliveryTime,
    pageState: params.pageState,
    setError: sessionBits.setError,
    navigate: params.navigate,
    setSearchParams: params.setSearchParams,
  })
  const paymentFieldState = getPaymentFieldState({
    customRechargeAmount: checkoutState.customRechargeAmount,
    selectedRechargeAmount: checkoutState.selectedRechargeAmount,
    rechargeFieldError: checkoutState.rechargeFieldError,
    merchantWithdrawAmount: checkoutState.merchantWithdrawAmount,
    merchantWithdrawFieldError: checkoutState.merchantWithdrawFieldError,
    merchantProfile: derived.merchantProfile,
  })
  const checkoutSummary = getCheckoutSummary({
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    customerRequiresDefaultAddressUpdate: derived.customerRequiresDefaultAddressUpdate,
    deliveryAddress: checkoutState.deliveryAddress,
    quantities: checkoutState.quantities,
    selectedMenuItemConfigurations: checkoutState.selectedMenuItemConfigurations,
    selectedCouponId: checkoutState.selectedCouponId,
  })

  return {
    todayDeliveryWindow,
    actionArgs,
    paymentFieldState,
    checkoutSummary,
  }
}

export function useDeliveryConsolePageViewService(params: DeliveryPageViewParams) {
  const sessionBits = getPageViewServiceSession(params.sessionService)
  const selections = getPageViewServiceSelections(params.pageState, sessionBits)
  const checkoutState = getPageViewServiceCheckoutState(params.pageState)

  const role = sessionBits.session?.user.role ?? ROLE.customer
  const workspaceViews = getWorkspaceViews(
    params.locationPathname,
    params.searchParams,
    selections.merchantWorkspaceState,
    selections.merchantApplicationState,
  )
  const derived = getDerivedPageView({
    routeOrderId: params.routeOrderId,
    sessionService: params.sessionService,
    selections,
    customerStoreSearch: checkoutState.customerStoreSearch,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
  })
  runPageViewEffects({
    params,
    sessionBits,
    workspaceViews,
    derived,
    selections,
    checkoutState,
  })
  const currentDisplayName = getCurrentDisplayName(sessionBits.session, derived)
  const computedState = getPageViewComputedState({
    params,
    sessionBits,
    derived,
    checkoutState,
  })

  return {
    ...getPageViewDataProps({
      role,
      workspaceViews,
      derived,
      currentDisplayName,
      pageState: params.pageState,
      paymentFieldState: computedState.paymentFieldState,
      checkoutSummary: computedState.checkoutSummary,
      todayDeliveryWindow: computedState.todayDeliveryWindow,
      customerStoreSearchHistory: sessionBits.customerStoreSearchHistory,
      seenCustomerProfileNoticeIds: params.pageState.notices.seenCustomerProfileNoticeIds,
    }),
    ...getPageViewActionProps({
      actionArgs: computedState.actionArgs,
      todayDeliveryWindow: computedState.todayDeliveryWindow,
      setMerchantWorkspaceState: params.pageState.setMerchantWorkspaceState,
      setMerchantApplicationState: params.pageState.setMerchantApplicationState,
    }),
    ...getPageViewConstantProps(),
  }
}
