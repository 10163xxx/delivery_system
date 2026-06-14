import type {
  DeliveryConsoleSessionState as SessionState,
} from '@/pages/DeliveryConsole/objects/DeliveryConsoleScreenObjects'

export function getScreenSessionActions(sessionState: SessionState) {
  return {
    loadState: sessionState.loadState,
    logout: sessionState.logout,
    runAction: sessionState.runAction,
    setCustomerStoreSearchHistory: sessionState.setCustomerStoreSearchHistory,
    setFavoriteStoreIds: sessionState.setFavoriteStoreIds,
    setBlockedStoreIds: sessionState.setBlockedStoreIds,
    setError: sessionState.setError,
    setSession: sessionState.setSession,
  }
}

export function getScreenSessionDisplayState(sessionState: SessionState) {
  return {
    busy: sessionState.busy,
    customerStoreSearchHistory: sessionState.customerStoreSearchHistory,
    favoriteStoreIds: sessionState.favoriteStoreIds,
    blockedStoreIds: sessionState.blockedStoreIds,
    error: sessionState.error,
    headerAction: sessionState.headerAction,
    session: sessionState.session,
    showLogoutModal: sessionState.showLogoutModal,
    state: sessionState.state,
  }
}
