import type { Dispatch, SetStateAction } from 'react'
import type { AuthSession, DeliveryAppState } from '@/shared/object/core/SharedObjects'
import { browserRuntime, browserStorage, deliveryApi } from '@/shared/api/SharedApi'
import {
  LOGOUT_TRANSITION_MS,
} from '@/shared/delivery/DeliveryServices'
import { HEADER_ACTION, type HeaderAction } from '@/shared/object/core/DeliveryAppObjects'

const LOAD_FAILED_MESSAGE = '加载失败'
const ACTION_FAILED_MESSAGE = '操作失败'

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage
}

export function readStoredCustomerSearchHistory() {
  return browserStorage.readCustomerStoreSearchHistory()
}

export function buildSessionServiceResult(args: {
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

export function createSessionLoadActions(args: {
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setBusy: Dispatch<SetStateAction<boolean>>
  setHeaderAction: Dispatch<SetStateAction<HeaderAction>>
}) {
  const { setSession, setState, setError, setBusy, setHeaderAction } = args

  async function restoreSession() {
    try {
      const nextSession = await deliveryApi.auth.getSession()
      setSession(nextSession)
      setError(null)
    } catch {
      browserStorage.clearSessionToken()
      setSession(null)
    }
  }

  async function loadState() {
    setHeaderAction(HEADER_ACTION.refresh)
    setBusy(true)
    try {
      const nextState = await deliveryApi.customer.getState()
      setState(nextState)
      setError(null)
    } catch (loadError) {
      setError(getErrorMessage(loadError, LOAD_FAILED_MESSAGE))
    } finally {
      setBusy(false)
      setHeaderAction(null)
    }
  }

  async function syncStateSilently() {
    try {
      const nextState = await deliveryApi.customer.getState()
      setState(nextState)
    } catch {
      // Keep the current screen stable during background sync attempts.
    }
  }

  return {
    restoreSession,
    loadState,
    syncStateSilently,
  }
}

export function createSessionActionRunner(args: {
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  setError: Dispatch<SetStateAction<string | null>>
  setBusy: Dispatch<SetStateAction<boolean>>
  setHeaderAction: Dispatch<SetStateAction<HeaderAction>>
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>
}) {
  const {
    setSession,
    setState,
    setError,
    setBusy,
    setHeaderAction,
    setShowLogoutModal,
  } = args

  async function logout() {
    setHeaderAction(HEADER_ACTION.logout)
    setShowLogoutModal(true)
    setBusy(true)
    try {
      await browserRuntime.requestNextPaint()
      await deliveryApi.auth.logout()
    } catch {
      // Ignore logout failures and clear local session anyway.
    } finally {
      await browserRuntime.delay(LOGOUT_TRANSITION_MS)
      browserStorage.clearSessionToken()
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
      setError(getErrorMessage(actionError, ACTION_FAILED_MESSAGE))
      return false
    } finally {
      setBusy(false)
    }
  }

  return {
    logout,
    runAction,
  }
}
