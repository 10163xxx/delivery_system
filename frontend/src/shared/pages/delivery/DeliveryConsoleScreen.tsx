import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AuthScreen from '@/auth/pages/AuthScreen'
import { buildAdminProps, buildCustomerProps, buildMerchantProps, buildRiderProps } from '@/shared/app-build-role-props'
import { createCustomerActions } from '@/customer/app/actions/customer-actions'
import { createMerchantActions } from '@/merchant/app/actions/merchant-actions'
import type { AuthSession } from '@/shared/object'
import { ROLE, ROUTE_PATH } from '@/shared/object'
import { DeliveryConsoleStage } from '@/shared/pages/delivery/DeliveryConsoleStage'
import { useDeliveryConsolePageState } from '@/shared/delivery-app/page-state-service'
import { useDeliveryConsolePageViewService } from '@/shared/delivery-app/page-view-service'
import { useDeliveryConsoleSessionService } from '@/shared/delivery-app/session-service'

type PageViewState = ReturnType<typeof useDeliveryConsolePageViewService>
type PageState = ReturnType<typeof useDeliveryConsolePageState>
type SessionState = ReturnType<typeof useDeliveryConsoleSessionService>
type Navigate = ReturnType<typeof useNavigate>

function getCustomerActionState(pageView: PageViewState, pageState: PageState, sessionState: SessionState) {
  return {
    state: sessionState.state,
    selectedStore: pageView.selectedStore,
    selectedStoreIsOpen: pageView.selectedStoreIsOpen,
    selectedCustomer: pageView.selectedCustomer,
    selectedCoupon: pageView.selectedCoupon,
    quantities: pageState.quantities,
    deliveryAddress: pageState.deliveryAddress,
    scheduledDeliveryTime: pageState.scheduledDeliveryTime,
    scheduledDeliveryTouched: pageState.scheduledDeliveryTouched,
    remark: pageState.remark,
    payableTotalCents: pageView.payableTotalCents,
    partialRefundDrafts: pageState.partialRefundDrafts,
    afterSalesDrafts: pageState.afterSalesDrafts,
    reviewDrafts: pageState.reviewDrafts,
    orderChatDrafts: pageState.orderChatDrafts,
    customerNameDraft: pageState.customerNameDraft,
    addressDraft: pageState.addressDraft,
    customRechargeAmount: pageState.customRechargeAmount,
  }
}

function getCustomerActionSetters(pageState: PageState, sessionState: SessionState) {
  return {
    setCustomerStoreSearchDraft: pageState.setCustomerStoreSearchDraft,
    setCustomerStoreSearch: pageState.setCustomerStoreSearch,
    setCustomerStoreSearchHistory: sessionState.setCustomerStoreSearchHistory,
    setDeliveryAddressError: pageState.setDeliveryAddressError,
    setScheduledDeliveryError: pageState.setScheduledDeliveryError,
    setScheduledDeliveryTime: pageState.setScheduledDeliveryTime,
    setScheduledDeliveryTouched: pageState.setScheduledDeliveryTouched,
    setRemark: pageState.setRemark,
    setQuantities: pageState.setQuantities,
    setIsCheckoutExpanded: pageState.setIsCheckoutExpanded,
    setSelectedCouponId: pageState.setSelectedCouponId,
    setError: sessionState.setError,
    setOrderChatErrors: pageState.setOrderChatErrors,
    setOrderChatDrafts: pageState.setOrderChatDrafts,
    setPartialRefundErrors: pageState.setPartialRefundErrors,
    setPartialRefundDrafts: pageState.setPartialRefundDrafts,
    setAfterSalesErrors: pageState.setAfterSalesErrors,
    setAfterSalesDrafts: pageState.setAfterSalesDrafts,
    setReviewErrors: pageState.setReviewErrors,
    setReviewDrafts: pageState.setReviewDrafts,
    setAddressFormErrors: pageState.setAddressFormErrors,
    setAddressDraft: pageState.setAddressDraft,
    setSession: sessionState.setSession,
    setCustomRechargeAmount: pageState.setCustomRechargeAmount,
    setSelectedRechargeAmount: pageState.setSelectedRechargeAmount,
    setRechargeFieldError: pageState.setRechargeFieldError,
  }
}

function getCustomerActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: Navigate
}) {
  const { pageView, pageState, sessionState, navigate } = args

  return createCustomerActions({
    ...getCustomerActionState(pageView, pageState, sessionState),
    runAction: sessionState.runAction,
    navigate,
    customerStoreSearchDraft: pageState.customerStoreSearchDraft,
    ...getCustomerActionSetters(pageState, sessionState),
  })
}

function getMerchantDraftContext(pageView: PageViewState, pageState: PageState) {
  return {
    merchantDraft: pageState.merchantDraft,
    isMerchantImageUploading: pageState.isMerchantImageUploading,
    currentDisplayName: pageView.currentDisplayName,
    menuItemDrafts: pageState.menuItemDrafts,
    menuComposerOpen: pageState.menuComposerOpen,
    menuItemImageUploading: pageState.menuItemImageUploading,
    setMerchantDraft: pageState.setMerchantDraft,
    setMerchantFormErrors: pageState.setMerchantFormErrors,
    setMenuItemFormErrors: pageState.setMenuItemFormErrors,
    setMenuItemDrafts: pageState.setMenuItemDrafts,
    setMenuComposerOpen: pageState.setMenuComposerOpen,
    setIsMerchantImageUploading: pageState.setIsMerchantImageUploading,
    setMenuItemImageUploading: pageState.setMenuItemImageUploading,
  }
}

function getMerchantActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  const { pageView, pageState, sessionState } = args

  return createMerchantActions({
    runAction: sessionState.runAction,
    setError: sessionState.setError,
    draft: getMerchantDraftContext(pageView, pageState),
    profile: {
      merchantProfileDraft: pageState.merchantProfileDraft,
      merchantProfile: pageView.merchantProfile,
      setMerchantProfileFormErrors: pageState.setMerchantProfileFormErrors,
    },
    withdraw: {
      merchantProfile: pageView.merchantProfile,
      merchantWithdrawAmount: pageState.merchantWithdrawAmount,
      setMerchantWithdrawFieldError: pageState.setMerchantWithdrawFieldError,
      setMerchantWithdrawAmount: pageState.setMerchantWithdrawAmount,
    },
    support: {
      partialRefundResolutionDrafts: pageState.partialRefundResolutionDrafts,
      setPartialRefundResolutionDrafts: pageState.setPartialRefundResolutionDrafts,
    },
  })
}

function getDefaultRouteForSession(session: AuthSession) {
  if (session.user.role === ROLE.customer) return ROUTE_PATH.customerOrder
  if (session.user.role === ROLE.merchant) return ROUTE_PATH.merchantApplicationSubmit
  return ROUTE_PATH.root
}

function getCustomerRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: Navigate
  customerActions: ReturnType<typeof createCustomerActions>
}) {
  const { pageView, pageState, sessionState, navigate, customerActions } = args
  return buildCustomerProps({ pageView, pageState, sessionService: sessionState, navigate, ...customerActions })
}

function getMerchantRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: Navigate
  submitOrderChatMessage: ReturnType<typeof createCustomerActions>['submitOrderChatMessage']
  merchantActions: ReturnType<typeof createMerchantActions>
}) {
  const { pageView, pageState, sessionState, navigate, submitOrderChatMessage, merchantActions } = args
  return buildMerchantProps({
    pageView,
    pageState,
    sessionService: sessionState,
    navigate,
    submitOrderChatMessage,
    ...merchantActions,
  })
}

export function DeliveryConsoleScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId: routeOrderId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionService = useDeliveryConsoleSessionService()
  const pageState = useDeliveryConsolePageState()
  const pageView = useDeliveryConsolePageViewService({
    locationPathname: location.pathname,
    navigate,
    routeOrderId,
    searchParams,
    setSearchParams,
    sessionService: {
      session: sessionService.session,
      state: sessionService.state,
      setError: sessionService.setError,
      customerStoreSearchHistory: sessionService.customerStoreSearchHistory,
      setCustomerStoreSearchHistory: sessionService.setCustomerStoreSearchHistory,
    },
    pageState,
  })

  function handleAuthenticated(session: AuthSession) {
    pageState.resetPageState()
    navigate(getDefaultRouteForSession(session), { replace: true })
    sessionService.setSession(session)
  }

  if (!sessionService.session) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  const customerActions = getCustomerActions({
    pageView,
    pageState,
    sessionState: sessionService,
    navigate,
  })
  const merchantActions = getMerchantActions({
    pageView,
    pageState,
    sessionState: sessionService,
  })

  return (
    <DeliveryConsoleStage
      role={pageView.role}
      state={sessionService.state}
      error={sessionService.error}
      busy={sessionService.busy}
      currentDisplayName={pageView.currentDisplayName}
      isRefreshing={sessionService.headerAction === 'refresh'}
      isLoggingOut={sessionService.headerAction === 'logout'}
      loadState={sessionService.loadState}
      logout={sessionService.logout}
      roleLabels={pageView.roleLabels}
      showLogoutModal={sessionService.showLogoutModal}
      customerProps={getCustomerRoleProps({
        pageView,
        pageState,
        sessionState: sessionService,
        navigate,
        customerActions,
      })}
      merchantProps={getMerchantRoleProps({
        pageView,
        pageState,
        sessionState: sessionService,
        navigate,
        submitOrderChatMessage: customerActions.submitOrderChatMessage,
        merchantActions,
      })}
      riderProps={buildRiderProps({
        pageView,
        pageState,
        sessionService,
        submitOrderChatMessage: customerActions.submitOrderChatMessage,
      })}
      adminProps={buildAdminProps({ pageView, pageState, sessionService })}
    />
  )
}
