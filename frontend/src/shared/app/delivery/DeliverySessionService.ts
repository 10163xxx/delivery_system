import { useEffect, useState } from 'react'
import type { AuthSession, DeliveryAppState } from '@/shared/object/core/SharedObjects'
import { STATE_POLL_INTERVAL_MS } from '@/shared/delivery/DeliveryServices'
import type { HeaderAction } from '@/shared/object/core/DeliveryAppObjects'
import { browserRuntime, browserStorage } from '@/shared/api/SharedApi'
import {
  buildSessionServiceResult,
  createSessionActionRunner,
  createSessionLoadActions,
  readStoredCustomerSearchHistory,
} from '@/shared/app/delivery/DeliverySessionResult'

export function useDeliveryConsoleSessionService() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [state, setState] = useState<DeliveryAppState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [headerAction, setHeaderAction] = useState<HeaderAction>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [customerStoreSearchHistory, setCustomerStoreSearchHistory] = useState<string[]>(() => {
    try {
      return readStoredCustomerSearchHistory()
    } catch {
      browserStorage.clearCustomerStoreSearchHistory()
      return []
    }
  })
  const loadActions = createSessionLoadActions({
    setSession,
    setState,
    setError,
    setBusy,
    setHeaderAction,
  })
  const actionRunner = createSessionActionRunner({
    setSession,
    setState,
    setError,
    setBusy,
    setHeaderAction,
    setShowLogoutModal,
  })

  useEffect(() => {
    void loadActions.restoreSession()
  }, [])

  useEffect(() => {
    if (!session) return
    void loadActions.loadState()
  }, [session])

  useEffect(() => {
    if (!session) return

    const stopPolling = browserRuntime.startInterval(() => {
      void loadActions.syncStateSilently()
    }, STATE_POLL_INTERVAL_MS)

    return stopPolling
  }, [session])

  return buildSessionServiceResult({
    session,
    setSession,
    state,
    setState,
    error,
    setError,
    busy,
    setBusy,
    headerAction,
    showLogoutModal,
    customerStoreSearchHistory,
    setCustomerStoreSearchHistory,
    loadState: loadActions.loadState,
    logout: actionRunner.logout,
    runAction: actionRunner.runAction,
  })
}
