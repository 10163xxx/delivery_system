import { useEffect, useState } from 'react'
import type { AuthSession, DeliveryAppState } from '@/domain'
import { clearSessionToken, getSession, getState, logout as requestLogout } from '@/api'
import {
  CUSTOMER_STORE_SEARCH_HISTORY_KEY,
  LOGOUT_TRANSITION_MS,
  MAX_CUSTOMER_STORE_SEARCH_HISTORY,
  STATE_POLL_INTERVAL_MS,
  waitForNextPaint,
} from '@/features/delivery-console'
import type { HeaderAction } from '@/features/delivery-console'

export function useDeliveryConsoleSessionService() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [state, setState] = useState<DeliveryAppState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [headerAction, setHeaderAction] = useState<HeaderAction>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [customerStoreSearchHistory, setCustomerStoreSearchHistory] = useState<string[]>([])

  useEffect(() => {
    void restoreSession()
  }, [])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        setCustomerStoreSearchHistory(
          parsed
            .filter((entry): entry is string => typeof entry === 'string')
            .slice(0, MAX_CUSTOMER_STORE_SEARCH_HISTORY),
        )
      }
    } catch {
      window.localStorage.removeItem(CUSTOMER_STORE_SEARCH_HISTORY_KEY)
    }
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
      setError(loadError instanceof Error ? loadError.message : '加载失败')
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
      setError(actionError instanceof Error ? actionError.message : '操作失败')
      return false
    } finally {
      setBusy(false)
    }
  }

  return {
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
  }
}
