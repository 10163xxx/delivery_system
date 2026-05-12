import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AuthScreen from '@/pages/auth/AuthScreen'
import type { AuthSession } from '@/shared/object/core/SharedObjects'
import { DeliveryAppStage } from '@/shared/pages/delivery/DeliveryAppStage'
import { HEADER_ACTION } from '@/shared/object/core/DeliveryAppObjects'
import { useDeliveryConsolePageState } from '@/shared/app/delivery/DeliveryPageStateService'
import { useDeliveryConsolePageViewService } from '@/shared/app/delivery/DeliveryPageViewService'
import { useDeliveryConsoleSessionService } from '@/shared/app/delivery/DeliverySessionService'
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
} from '@/shared/pages/delivery/DeliveryScreenAssembly'

export function DeliveryRootScreen() {
  const location = useLocation()
  const navigate = useNavigate()
  const { orderId: routeOrderId } = useParams()
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
