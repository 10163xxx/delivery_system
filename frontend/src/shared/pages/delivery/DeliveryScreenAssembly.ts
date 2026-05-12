import type { NavigateFunction } from 'react-router-dom'
import { createCustomerActions } from '@/customer/app/actions/CustomerActions'
import { createMerchantActions } from '@/merchant/app/actions/MerchantActions'
import { buildAdminProps, buildCustomerProps, buildMerchantProps, buildRiderProps } from '@/shared/app/role-props'
import { ROLE, ROUTE_PATH, type AuthSession } from '@/shared/object/core/SharedObjects'
import type {
  DeliveryConsolePageState as PageState,
  DeliveryConsolePageViewState as PageViewState,
  DeliveryConsoleSessionState as SessionState,
} from '@/shared/object/core/DeliveryConsoleScreenObjects'
import {
  createCustomerConsoleActions,
  createMerchantConsoleActions,
  getScreenSessionActions,
  getScreenSessionDisplayState,
} from '@/shared/pages/delivery/DeliveryScreenActionGroups'

export function buildScreenSessionState(sessionState: SessionState) {
  return {
    ...getScreenSessionDisplayState(sessionState),
    ...getScreenSessionActions(sessionState),
  }
}

export function createPageViewSessionState(sessionState: SessionState) {
  const { session, state, setError, customerStoreSearchHistory, setCustomerStoreSearchHistory } =
    buildScreenSessionState(sessionState)

  return {
    session,
    state,
    setError,
    customerStoreSearchHistory,
    setCustomerStoreSearchHistory,
  }
}

export function getDefaultRouteForSession(session: AuthSession) {
  if (session.user.role === ROLE.customer) return ROUTE_PATH.customerOrder
  if (session.user.role === ROLE.merchant) return ROUTE_PATH.merchantApplicationSubmit
  return ROUTE_PATH.root
}

export function getCustomerActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: NavigateFunction
}) {
  return createCustomerConsoleActions(args)
}

export function getMerchantActions(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
}) {
  return createMerchantConsoleActions(args)
}

export function getCustomerRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: NavigateFunction
  customerActions: ReturnType<typeof createCustomerActions>
}) {
  const { pageView, pageState, sessionState, navigate, customerActions } = args
  return buildCustomerProps({ pageView, pageState, sessionService: sessionState, navigate, ...customerActions })
}

export function getMerchantRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionState: SessionState
  navigate: NavigateFunction
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

export function getRiderRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionService: SessionState
  submitOrderChatMessage: ReturnType<typeof createCustomerActions>['submitOrderChatMessage']
}) {
  return buildRiderProps(args)
}

export function getAdminRoleProps(args: {
  pageView: PageViewState
  pageState: PageState
  sessionService: SessionState
}) {
  return buildAdminProps(args)
}
