import {
  AUTH_SCREEN_MODE,
  type AuthScreenProps,
} from '@/pages/AuthScreen/objects/AuthPageObjects'
import { useAuthScreenState } from '@/pages/AuthScreen/hooks/AuthScreenState'
import type {
  LoginRequest,
  Password,
  RegisterRequest,
  Username,
} from '@/objects/core/SharedObjects'
import { REGISTERABLE_ROLES, ROLE } from '@/objects/core/SharedObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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

type AuthScreenState = ReturnType<typeof useAuthScreenState>

function AuthHeroPanel() {
  return (
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
  )
}

function AuthModeTabs({ mode, setMode }: Pick<AuthScreenState, 'mode' | 'setMode'>) {
  return (
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
  )
}

function LoginForm({
  busy,
  handleLoginSubmit,
  loginDraft,
  setLoginDraft,
}: Pick<AuthScreenState, 'busy' | 'handleLoginSubmit' | 'loginDraft' | 'setLoginDraft'>) {
  return (
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
              username: asDomainText<Username>(event.target.value),
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
              password: asDomainText<Password>(event.target.value),
            }))
          }
        />
      </label>
      <button className="primary-button" disabled={busy} type="submit">
        登录系统
      </button>
    </form>
  )
}

function RegisterForm({
  busy,
  handleRegisterSubmit,
  registerDraft,
  setRegisterDraft,
}: Pick<AuthScreenState, 'busy' | 'handleRegisterSubmit' | 'registerDraft' | 'setRegisterDraft'>) {
  return (
    <form className="auth-form" onSubmit={handleRegisterSubmit}>
      <label>
        <span>用户名</span>
        <input
          value={registerDraft.username}
          onChange={(event) =>
            setRegisterDraft((current) => ({
              ...current,
              username: asDomainText<Username>(event.target.value),
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
              password: asDomainText<Password>(event.target.value),
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
  )
}

function AuthFormCard(state: AuthScreenState) {
  const { busy, error, mode } = state

  return (
    <section className="auth-form-card">
      <AuthModeTabs {...state} />

      {error ? <div className="banner error">{error}</div> : null}
      {busy ? <div className="banner info">正在验证账号信息...</div> : null}

      {mode === AUTH_SCREEN_MODE.login ? <LoginForm {...state} /> : <RegisterForm {...state} />}
    </section>
  )
}

export default function AuthScreen(props: AuthScreenProps) {
  const authState = useAuthScreenState(props)

  return (
    <main className="auth-shell auth-shell--warm">
      <section className="auth-panel">
        <AuthHeroPanel />
        <AuthFormCard {...authState} />
      </section>
    </main>
  )
}
