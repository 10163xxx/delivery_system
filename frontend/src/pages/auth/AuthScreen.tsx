import { useState } from 'react'
import type { FormEvent } from 'react'
import type {
  LoginRequest,
  RegisterRequest,
} from '@/objects/core/SharedObjects'
import {
  AUTH_SCREEN_MODE,
  type AuthScreenMode,
  type AuthScreenProps,
} from '@/objects/auth/page/AuthPageObjects'
import {
  clearSessionToken,
  login,
  register,
  saveSessionToken,
} from '@/system/api/SharedApi'
import { REGISTERABLE_ROLES, ROLE } from '@/objects/core/SharedObjects'

const registerRoles: (typeof REGISTERABLE_ROLES)[number][] = [...REGISTERABLE_ROLES]
const loginRoles: LoginRequest['role'][] = [ROLE.customer, ROLE.merchant, ROLE.rider, ROLE.admin]
const roleLabels: Record<(typeof REGISTERABLE_ROLES)[number], string> = {
  customer: '顾客',
  merchant: '商家',
  rider: '骑手',
}
const loginRoleLabels: Record<LoginRequest['role'], string> = {
  ...roleLabels,
  admin: '管理员',
}

const AUTH_SCREEN_MESSAGES = {
  loginFailed: '登录失败',
  registerFailed: '注册失败',
} as const

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthScreenMode>(AUTH_SCREEN_MODE.login)
  const [loginDraft, setLoginDraft] = useState<LoginRequest>({
    username: '',
    password: '',
    role: ROLE.customer,
  })
  const [registerDraft, setRegisterDraft] = useState<RegisterRequest>({
    username: '',
    password: '',
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

  return (
    <main className="auth-shell auth-shell--warm">
      <section className="auth-panel">
        <div className="auth-copy">
          <p className="eyebrow">Warm Delivery Club</p>
          <h1>外卖平台登录与注册</h1>
          <p>
            先完成账号登录，再进入对应角色的业务台。顾客、商家、骑手支持自助注册，管理员从登录入口进入。
          </p>
          <div className="auth-brand-scene">
            <img
              alt="外卖平台虚拟形象"
              className="auth-mascot"
              src="/mascots/delivery-buddy.svg"
            />
            <div className="auth-brand-notes">
              <strong>暖暖送</strong>
              <p>用一个会送餐、会保温、会陪你等餐的虚拟店长，把平台气质先立起来。</p>
              <div className="auth-brand-tags">
                <span>热餐准时</span>
                <span>门店丰富</span>
                <span>骑手可追踪</span>
              </div>
            </div>
          </div>
        </div>

        <section className="auth-form-card">
          <div className="auth-tabs">
            <button
              className={mode === AUTH_SCREEN_MODE.login ? 'role-pill active' : 'role-pill'}
              onClick={() => setMode(AUTH_SCREEN_MODE.login)}
              type="button"
            >
              登录
            </button>
            <button
              className={mode === AUTH_SCREEN_MODE.register ? 'role-pill active' : 'role-pill'}
              onClick={() => setMode(AUTH_SCREEN_MODE.register)}
              type="button"
            >
              注册
            </button>
          </div>

          {error ? <div className="banner error">{error}</div> : null}
          {busy ? <div className="banner info">正在验证账号信息...</div> : null}

          {mode === AUTH_SCREEN_MODE.login ? (
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <label>
                <span>登录身份</span>
                <select
                  value={loginDraft.role}
                  onChange={(event) =>
                    setLoginDraft((current) => ({
                      ...current,
                      role: event.target.value as LoginRequest['role'],
                    }))
                  }
                >
                  {loginRoles.map((role) => (
                    <option key={role} value={role}>
                      {loginRoleLabels[role]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>用户名</span>
                <input
                  value={loginDraft.username}
                  onChange={(event) =>
                    setLoginDraft((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>密码</span>
                <input
                  type="password"
                  value={loginDraft.password}
                  onChange={(event) =>
                    setLoginDraft((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
              </label>
              <button className="primary-button" disabled={busy} type="submit">
                登录系统
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
              <label>
                <span>用户名</span>
                <input
                  value={registerDraft.username}
                  onChange={(event) =>
                    setRegisterDraft((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>密码</span>
                <input
                  type="password"
                  value={registerDraft.password}
                  onChange={(event) =>
                    setRegisterDraft((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
              </label>
              <label>
                <span>注册角色</span>
                <select
                  value={registerDraft.role}
                  onChange={(event) =>
                    setRegisterDraft((current) => ({
                      ...current,
                      role: event.target.value as RegisterRequest['role'],
                    }))
                  }
                >
                  {registerRoles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
                </select>
              </label>
              <button className="primary-button" disabled={busy} type="submit">
                创建账号
              </button>
            </form>
          )}
        </section>
      </section>
    </main>
  )
}
