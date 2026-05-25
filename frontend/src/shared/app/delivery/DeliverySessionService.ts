import { useEffect, useState } from 'react'
import type { AuthSession, DeliveryAppState } from '@/shared/object/core/SharedObjects'
import { STATE_POLL_INTERVAL_MS } from '@/shared/delivery/DeliveryServices'
import type { HeaderAction } from '@/shared/object/core/DeliveryAppObjects'
import {
  clearCustomerStoreSearchHistory,
  startInterval,
} from '@/shared/api/SharedApi'
import {
  buildSessionServiceResult,
  loadState,
  readStoredCustomerSearchHistory,
  restoreSession,
  runAction,
  runLogout,
  syncStateSilently,
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
      clearCustomerStoreSearchHistory()
      return []
    }
  })
  useEffect(() => {
    void restoreSession({
      setSession,
      setError,
    })
  }, [])

  useEffect(() => {
    if (!session) return
    void loadState({
      setState,
      setError,
      setBusy,
      setHeaderAction,
    })
  }, [session])

  useEffect(() => {
    if (!session) return

    const stopPolling = startInterval(() => {
      void syncStateSilently({
        setState,
      })
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
    loadState: () => loadState({
      setState,
      setError,
      setBusy,
      setHeaderAction,
    }),
    logout: () => runLogout({
      setSession,
      setState,
      setError,
      setBusy,
      setHeaderAction,
      setShowLogoutModal,
    }),
    runAction: (action) => runAction({
      action,
      setState,
      setError,
      setBusy,
    }),
  })
}
