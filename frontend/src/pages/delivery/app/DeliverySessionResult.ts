import type { Dispatch, SetStateAction } from 'react'
import type {
  AuthSession,
  DeliveryAppState,
  DisplayText,
  StoreId,
} from '@/objects/core/SharedObjects'
import {
  clearSessionToken,
  delay,
  getSession,
  getState,
  logout as logoutSession,
  requestNextPaint,
  readCustomerStoreSearchHistory,
} from '@/system/api/SharedApi'
import {
  LOGOUT_TRANSITION_MS,
} from '@/features/delivery/DeliveryServices'
import { asDomainText } from '@/features/delivery/DeliveryShared'
import { HEADER_ACTION, type HeaderAction } from '@/pages/delivery/objects/DeliveryAppObjects'

const LOAD_FAILED_MESSAGE = '加载失败'
const ACTION_FAILED_MESSAGE = '操作失败'

function getErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage
}

export function readStoredCustomerSearchHistory() {
  return readCustomerStoreSearchHistory()
}

type SessionRestoreArgs = {
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
}

type SessionStateArgs = {
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
  setBusy: Dispatch<SetStateAction<boolean>>
  setHeaderAction: Dispatch<SetStateAction<HeaderAction>>
}

type SessionSilentSyncArgs = {
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
}

type SessionLogoutArgs = {
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
  setBusy: Dispatch<SetStateAction<boolean>>
  setHeaderAction: Dispatch<SetStateAction<HeaderAction>>
  setShowLogoutModal: Dispatch<SetStateAction<boolean>>
}

type SessionActionArgs = {
  action: () => Promise<DeliveryAppState>
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  setError: Dispatch<SetStateAction<DisplayText | null>>
  setBusy: Dispatch<SetStateAction<boolean>>
}

export function buildSessionServiceResult(args: {
  session: AuthSession | null
  setSession: Dispatch<SetStateAction<AuthSession | null>>
  state: DeliveryAppState | null
  setState: Dispatch<SetStateAction<DeliveryAppState | null>>
  error: DisplayText | null
  setError: Dispatch<SetStateAction<DisplayText | null>>
  busy: boolean
  setBusy: Dispatch<SetStateAction<boolean>>
  headerAction: HeaderAction
  showLogoutModal: boolean
  customerStoreSearchHistory: string[]
  setCustomerStoreSearchHistory: Dispatch<SetStateAction<string[]>>
  favoriteStoreIds: StoreId[]
  setFavoriteStoreIds: Dispatch<SetStateAction<StoreId[]>>
  blockedStoreIds: StoreId[]
  setBlockedStoreIds: Dispatch<SetStateAction<StoreId[]>>
  loadState: () => Promise<void>
  logout: () => Promise<void>
  runAction: (action: () => Promise<DeliveryAppState>) => Promise<boolean>
}) {
  return args
}

export async function restoreSession(args: SessionRestoreArgs) {
  try {
    const nextSession = await getSession()
    args.setSession(nextSession)
    args.setError(null)
  } catch {
    clearSessionToken()
    args.setSession(null)
  }
}

export async function loadState(args: SessionStateArgs) {
  args.setHeaderAction(HEADER_ACTION.refresh)
  args.setBusy(true)
  try {
    const nextState = await getState()
    args.setState(nextState)
    args.setError(null)
  } catch (loadError) {
    args.setError(asDomainText<DisplayText>(getErrorMessage(loadError, LOAD_FAILED_MESSAGE)))
  } finally {
    args.setBusy(false)
    args.setHeaderAction(null)
  }
}

export async function syncStateSilently(args: SessionSilentSyncArgs) {
  try {
    const nextState = await getState()
    args.setState(nextState)
  } catch {
    // Keep the current screen stable during background sync attempts.
  }
}

export async function runLogout(args: SessionLogoutArgs) {
  args.setHeaderAction(HEADER_ACTION.logout)
  args.setShowLogoutModal(true)
  args.setBusy(true)
  try {
    await requestNextPaint()
    await logoutSession()
  } catch {
    // Ignore logout failures and clear local session anyway.
  } finally {
    await delay(LOGOUT_TRANSITION_MS)
    clearSessionToken()
    args.setBusy(false)
    args.setSession(null)
    args.setState(null)
    args.setError(null)
    args.setHeaderAction(null)
    args.setShowLogoutModal(false)
  }
}

export async function runAction(args: SessionActionArgs) {
  args.setBusy(true)
  try {
    const nextState = await args.action()
    args.setState(nextState)
    args.setError(null)
    return true
  } catch (actionError) {
    args.setError(asDomainText<DisplayText>(getErrorMessage(actionError, ACTION_FAILED_MESSAGE)))
    return false
  } finally {
    args.setBusy(false)
  }
}
