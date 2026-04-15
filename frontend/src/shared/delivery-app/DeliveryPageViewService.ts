import { getTodayDeliveryWindowAction } from './DeliveryPageViewActions'
import { getDeliveryConsolePageViewDerived } from './DeliveryPageViewDerived'
import { useDeliveryConsolePageViewEffects } from './DeliveryPageViewEffects'
import { getCheckoutSummary, getPaymentFieldState } from './DeliveryPageViewCheckout'
import {
  buildPageActionArgs,
  getPageViewActionProps,
  getPageViewConstantProps,
  getPageViewDataProps,
} from '@/shared/delivery-app/DeliveryPageViewProps'
import { ROLE } from '@/shared/object/SharedObjects'
import type { Params } from './DeliveryPageViewTypes'
import { getWorkspaceViews } from './DeliveryPageViewWorkspace'

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
    selectedStoreId,
    selectedMerchantStoreId,
    selectedRiderId,
    merchantWorkspaceState,
    setMerchantWorkspaceState,
    merchantApplicationState,
    setMerchantApplicationState,
    customerStoreSearch,
    scheduledDeliveryTime,
    quantities,
    selectedCouponId,
    customRechargeAmount,
    selectedRechargeAmount,
    merchantWithdrawAmount,
    merchantWithdrawFieldError,
    rechargeFieldError,
  } = pageState

  const role = session?.user.role ?? ROLE.customer
  const workspaceViews = getWorkspaceViews(
    locationPathname,
    searchParams,
    merchantWorkspaceState,
    merchantApplicationState,
  )

  const derived = getDeliveryConsolePageViewDerived({
    routeOrderId,
    sessionService,
    selectedCustomerId,
    selectedStoreCategory,
    selectedStoreId,
    selectedMerchantStoreId,
    selectedRiderId,
    customerStoreSearch,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
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
    customerWorkspaceView: workspaceViews.customerWorkspaceView,
    merchantWorkspaceView: workspaceViews.merchantWorkspaceView,
    merchantWorkspaceViewFromUrl: workspaceViews.merchantWorkspaceViewFromUrl,
    merchantApplicationViewFromUrl: workspaceViews.merchantApplicationViewFromUrl,
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
    session?.user.role === ROLE.customer
      ? (derived.selectedCustomer?.name ?? session.user.displayName)
      : session?.user.displayName ?? ''
  const actionArgs = buildPageActionArgs({
    state,
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    quantities,
    scheduledDeliveryTime,
    pageState,
    setError,
    setSearchParams,
  })
  const todayDeliveryWindow = getTodayDeliveryWindowAction()
  const paymentFieldState = getPaymentFieldState({
    customRechargeAmount,
    selectedRechargeAmount,
    rechargeFieldError,
    merchantWithdrawAmount,
    merchantWithdrawFieldError,
    merchantProfile: derived.merchantProfile,
  })
  const checkoutSummary = getCheckoutSummary({
    selectedStore: derived.selectedStore,
    selectedCustomer: derived.selectedCustomer,
    selectedStoreIsOpen: derived.selectedStoreIsOpen,
    quantities,
    selectedCouponId,
  })

  return {
    ...getPageViewDataProps({
      role,
      workspaceViews,
      derived,
      currentDisplayName,
      pageState,
      paymentFieldState,
      checkoutSummary,
      todayDeliveryWindow,
      customerStoreSearchHistory,
    }),
    ...getPageViewActionProps({
      actionArgs,
      todayDeliveryWindow,
      setMerchantWorkspaceState,
      setMerchantApplicationState,
    }),
    ...getPageViewConstantProps(),
  }
}
