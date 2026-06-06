import { useEffect, useState } from 'react'
import type {
  AuthSession,
  DeliveryAppState,
  DisplayText,
  StoreId,
} from '@/objects/core/SharedObjects'
import { STATE_POLL_INTERVAL_MS } from '@/features/delivery/DeliveryServices'
import type { HeaderAction } from '@/pages/delivery/objects/DeliveryAppObjects'
import {
  clearCustomerStoreSearchHistory,
  startInterval,
} from '@/system/api/SharedApi'
import {
  buildSessionServiceResult,
  loadState,
  readStoredCustomerSearchHistory,
  restoreSession,
  runAction,
  runLogout,
  syncStateSilently,
} from '@/pages/delivery/app/DeliverySessionResult'

export function useDeliveryConsoleSessionService() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [state, setState] = useState<DeliveryAppState | null>(null)
  const [error, setError] = useState<DisplayText | null>(null)
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
  const [favoriteStoreIds, setFavoriteStoreIds] = useState<StoreId[]>([])
  const [blockedStoreIds, setBlockedStoreIds] = useState<StoreId[]>([])
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
    favoriteStoreIds,
    setFavoriteStoreIds,
    blockedStoreIds,
    setBlockedStoreIds,
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
