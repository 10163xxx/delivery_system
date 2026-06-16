import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import AuthScreen from '@/pages/AuthScreen'
import { DeliveryAppStage } from '@/pages/DeliveryConsole/components/DeliveryAppStage'
import type { OrderId } from '@/objects/core/SharedObjects'
import { HEADER_ACTION } from '@/pages/DeliveryConsole/objects/DeliveryUiStateObjects'
import { useDeliveryConsolePageState } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageState'
import { useDeliveryConsolePageViewService } from '@/pages/DeliveryConsole/hooks/DeliveryConsolePageView'
import { useDeliveryConsoleSessionService } from '@/pages/AuthScreen/hooks/AuthSessionService'
import {
  buildScreenSessionState,
  createPageViewSessionState,
  getAdminRoleProps,
  getCustomerActions,
  getCustomerRoleProps,
  getMerchantActions,
  getMerchantRoleProps,
  getRiderRoleProps,
} from '@/pages/DeliveryConsole/functions/DeliveryScreenAssembly'
import { handleDeliveryRootAuthenticated } from '@/pages/DeliveryConsole/functions/DeliveryRootSession'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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

  if (!session) {
    return (
      <AuthScreen
        onAuthenticated={(authenticatedSession) => handleDeliveryRootAuthenticated({
          navigate,
          resetPageState,
          session: authenticatedSession,
          setSession,
        })}
      />
    )
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
