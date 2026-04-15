import { useEffect, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { AuthSession, DeliveryAppState } from '@/shared/object/SharedObjects'
import { clearSessionToken, getSession, getState, logout as requestLogout } from '@/shared/api/SharedApi'
import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  LOGOUT_TRANSITION_MS,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  STATE_POLL_INTERVAL_MS,
  waitForNextPaint,
} from '@/shared/delivery/DeliveryServices'
import type { HeaderAction } from '@/shared/delivery-app/DeliveryAppObjects'

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage
}

function readStoredCustomerSearchHistory() {
  const stored = window.localStorage.getItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
  if (!stored) return []

  const parsed = JSON.parse(stored)
  if (!Array.isArray(parsed)) return []

  return parsed
    .filter((entry): entry is string => typeof entry === 'string')
    .slice(0, MAX_CUSTOMER_STORE_SEARCH_HISTORY)
}

function buildSessionServiceResult(args: {
  session: AuthSession | null
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  state: DeliveryAppState | null
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
  busy: boolean
  setBusy: Dispatch<SetStateAction<boolean>>
  headerAction: HeaderAction
  showLogoutModal: boolean
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  loadState: () => Promise<void>
  logout: () => Promise<void>
  runAction: (action: () => Promise<DeliveryAppState>) => Promise<boolean>
}) {
  return args
}

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
      window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
      return []
    }
  })

  async function restoreSession() {
    try {
      const nextSession = await getSession()
      setSession(nextSession)
      setError(null)
    } catch {
      clearSessionToken()
      setSession(null)
    }
  }

  async function loadState() {
    setHeaderAction('refresh')
    setBusy(true)
    try {
      const nextState = await getState()
      setState(nextState)
      setError(null)
    } catch (loadError) {
      setError(getErrorMessage(loadError, '加载失败'))
    } finally {
      setBusy(false)
      setHeaderAction(null)
    }
  }

  async function syncStateSilently() {
    try {
      const nextState = await getState()
      setState(nextState)
    } catch {
      // Keep the current screen stable during background sync attempts.
    }
  }

  async function logout() {
    setHeaderAction('logout')
    setShowLogoutModal(true)
    setBusy(true)
    try {
      await waitForNextPaint()
      await requestLogout()
    } catch {
      // Ignore logout failures and clear local session anyway.
    } finally {
      await new Promise((resolve) => window.setTimeout(resolve, LOGOUT_TRANSITION_MS))
      clearSessionToken()
      setBusy(false)
      setSession(null)
      setState(null)
      setError(null)
      setHeaderAction(null)
      setShowLogoutModal(false)
    }
  }

  async function runAction(action: () => Promise<DeliveryAppState>) {
    setBusy(true)
    try {
      const nextState = await action()
      setState(nextState)
      setError(null)
      return true
    } catch (actionError) {
      setError(getErrorMessage(actionError, '操作失败'))
      return false
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    void restoreSession()
  }, [])

  useEffect(() => {
    if (!session) return
    void loadState()
  }, [session])

  useEffect(() => {
    if (!session) return

    const timer = window.setInterval(() => {
      void syncStateSilently()
    }, STATE_POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
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
    loadState,
    logout,
    runAction,
  })
}
