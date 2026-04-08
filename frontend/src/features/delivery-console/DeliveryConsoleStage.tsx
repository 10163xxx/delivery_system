import { MetricCard } from '@/components/delivery-console/LayoutPrimitives'
import { AdminRoleView } from '@/components/delivery-console/AdminRoleView'
import { CustomerRoleView } from '@/components/delivery-console/CustomerRoleView'
import { MerchantRoleView } from '@/components/delivery-console/MerchantRoleView'
import { RiderRoleView } from '@/components/delivery-console/RiderRoleView'

export function DeliveryConsoleStage(props: any) {
  const {
    role,
    state,
    error,
    busy,
    currentDisplayName,
    isRefreshing,
    isLoggingOut,
    loadState,
    logout,
    roleLabels,
    showLogoutModal,
  } = props

  return (
    <main className="delivery-app">
      {role === 'admin' ? (
        <section className="hero-panel">
          <div>
            <p className="eyebrow">Type-safe Delivery Operations</p>
            <h1>外卖业务前后端系统</h1>
            <p className="hero-copy">一个基于 React + TypeScript + Scala 的角色协同台，覆盖商家入驻审核、下单、接单、配送、双评分反馈与管理员处理。</p>
          </div>
          <div className="metrics-grid">
            <MetricCard label="总订单" value={String(state?.metrics.totalOrders ?? '--')} />
            <MetricCard label="进行中" value={String(state?.metrics.activeOrders ?? '--')} />
            <MetricCard label="已处理工单" value={String(state?.metrics.resolvedTickets ?? '--')} />
            <MetricCard label="综合平均分" value={(state?.metrics.averageRating ?? 0).toFixed(1)} />
          </div>
        </section>
      ) : null}

      <section className="workspace">
        <aside className="role-strip">
          <div className="session-card">
            <p className="eyebrow">Current Session</p>
            <strong>{currentDisplayName}</strong>
            <span>{roleLabels[role]}</span>
          </div>
          <button className={`secondary-button action-feedback-button${isRefreshing ? ' is-pending' : ''}`} disabled={busy} onClick={() => void loadState()} type="button">
            <span className={`button-indicator${isRefreshing ? ' is-spinning' : ''}`} />
            {isRefreshing ? '正在刷新...' : '刷新状态'}
          </button>
          <button className={`secondary-button action-feedback-button${isLoggingOut ? ' is-pending' : ''}`} disabled={busy} onClick={() => void logout()} type="button">
            <span className={`button-indicator${isLoggingOut ? ' is-spinning' : ''}`} />
            {isLoggingOut ? '正在退出...' : '退出登录'}
          </button>
        </aside>

        <section className="role-stage">
          {error ? <div className="banner error">{error}</div> : null}
          {busy ? <div className="banner info">正在同步业务状态...</div> : null}

          {role === 'customer' && state ? <CustomerRoleView {...props.customerProps} /> : null}
          {role === 'merchant' && state ? <MerchantRoleView {...props.merchantProps} /> : null}
          {role === 'rider' && state ? <RiderRoleView {...props.riderProps} /> : null}
          {role === 'admin' && state ? <AdminRoleView {...props.adminProps} /> : null}
        </section>
      </section>

      {showLogoutModal ? (
        <div className="logout-overlay" role="status" aria-live="polite">
          <div className="logout-modal">
            <div className="logout-spinner" />
            <p className="eyebrow">Signing Out</p>
            <h2>正在退出账号</h2>
            <p>正在安全结束当前会话，即将返回登录页。</p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
