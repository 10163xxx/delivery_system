import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AuthScreen from '@/pages/auth/AuthScreen'
import { DeliveryAppStage } from '@/pages/delivery/DeliveryAppStage'
import type { AuthSession, OrderId } from '@/objects/core/SharedObjects'
import { HEADER_ACTION } from '@/pages/delivery/objects/DeliveryAppObjects'
import { useDeliveryConsolePageState } from '@/pages/delivery/hooks/DeliveryPageStateService'
import { useDeliveryConsolePageViewService } from '@/pages/delivery/hooks/DeliveryPageViewService'
import { useDeliveryConsoleSessionService } from '@/pages/delivery/hooks/DeliverySessionService'
import {
  buildScreenSessionState,
  createPageViewSessionState,
  getAdminRoleProps,
  getCustomerActions,
  getCustomerRoleProps,
  getDefaultRouteForSession,
  getMerchantActions,
  getMerchantRoleProps,
  getRiderRoleProps,
} from '@/pages/delivery/DeliveryScreenAssembly'
import { asDomainText } from '@/features/delivery/DeliveryShared'

export function DeliveryRootScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId } = useParams()
  const routeOrderId = orderId ? asDomainText<OrderId>(orderId) : undefined
  const [searchParams, setSearchParams] = useSearchParams()
  const sessionService = useDeliveryConsoleSessionService()
  const pageState = useDeliveryConsolePageState()
  const screenSessionState = buildScreenSessionState(sessionService)
  const {
    session,
    state,
    error,
    busy,
    headerAction,
    showLogoutModal,
    setSession,
    loadState,
    logout,
  } = screenSessionState
  const { resetPageState } = pageState
  const pageView = useDeliveryConsolePageViewService({
    locationPathname: location.pathname,
    navigate,
    routeOrderId,
    searchParams,
    setSearchParams,
    sessionService: createPageViewSessionState(sessionService),
    pageState,
  })

  function handleAuthenticated(session: AuthSession) {
    resetPageState()
    navigate(getDefaultRouteForSession(session), { replace: true })
    setSession(session)
  }

  if (!session) {
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
    <DeliveryAppStage
      role={pageView.role}
      state={state}
      error={error}
      busy={busy}
      currentDisplayName={pageView.currentDisplayName}
      isRefreshing={headerAction === HEADER_ACTION.refresh}
      isLoggingOut={headerAction === HEADER_ACTION.logout}
      loadState={loadState}
      logout={logout}
      roleLabels={pageView.roleLabels}
      showLogoutModal={showLogoutModal}
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
      riderProps={getRiderRoleProps({
        pageView,
        pageState,
        sessionService,
        submitOrderChatMessage: customerActions.submitOrderChatMessage,
      })}
      adminProps={getAdminRoleProps({ pageView, pageState, sessionService })}
    />
  )
}
