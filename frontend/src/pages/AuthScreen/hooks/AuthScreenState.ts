import { useState, type FormEvent } from 'react'
import type {
  LoginRequest,
  Password,
  RegisterRequest,
  Username,
} from '@/objects/core/SharedObjects'
import {
  AUTH_SCREEN_MODE,
  type AuthScreenMode,
  type AuthScreenProps,
} from '@/pages/AuthScreen/objects/AuthPageObjects'
import {
  clearSessionToken,
  login,
  register,
  saveSessionToken,
} from '@/system/api/SharedApi'
import { ROLE } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

const AUTH_SCREEN_MESSAGES = {
  loginFailed: '登录失败',
  registerFailed: '注册失败',
} as const

export function useAuthScreenState({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthScreenMode>(AUTH_SCREEN_MODE.login)
  const [loginDraft, setLoginDraft] = useState<LoginRequest>({
    username: asDomainText<Username>(''),
    password: asDomainText<Password>(''),
    role: ROLE.customer,
  })
  const [registerDraft, setRegisterDraft] = useState<RegisterRequest>({
    username: asDomainText<Username>(''),
    password: asDomainText<Password>(''),
    role: ROLE.customer,
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      const session = await login(loginDraft)
      saveSessionToken(session.token)
      setError(null)
      onAuthenticated(session)
    } catch (actionError) {
      clearSessionToken()
      setError(actionError instanceof Error ? actionError.message : AUTH_SCREEN_MESSAGES.loginFailed)
    } finally {
      setBusy(false)
    }
  }

  async function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    try {
      const session = await register(registerDraft)
      saveSessionToken(session.token)
      setError(null)
      onAuthenticated(session)
    } catch (actionError) {
      clearSessionToken()
      setError(actionError instanceof Error ? actionError.message : AUTH_SCREEN_MESSAGES.registerFailed)
    } finally {
      setBusy(false)
    }
  }

  return {
    mode,
    setMode,
    loginDraft,
    setLoginDraft,
    registerDraft,
    setRegisterDraft,
    busy,
    error,
    handleLoginSubmit,
    handleRegisterSubmit,
  }
}
