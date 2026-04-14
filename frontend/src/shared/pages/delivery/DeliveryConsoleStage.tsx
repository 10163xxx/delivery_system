import type {
  AdminRoleProps,
  CustomerRoleProps,
  MerchantRoleProps,
  RiderRoleProps,
} from '@/shared/app-build-role-props'
import { AdminRoleView } from '@/admin/pages/AdminRoleView'
import { CustomerRoleView } from '@/customer/pages/CustomerRoleView'
import { DELIVERY_CONSOLE_COPY } from '@/shared/components/delivery-copy'
import { MetricCard } from '@/shared/components/LayoutPrimitives'
import { MerchantRoleView } from '@/merchant/pages/MerchantRoleView'
import { RiderRoleView } from '@/rider/pages/RiderRoleView'
import { ROLE, type DeliveryAppState, type Role } from '@/shared/object'

type DeliveryConsoleStageProps = {
  role: Role
  state: DeliveryAppState | null
  error: string | null
  busy: boolean
  currentDisplayName: string
  isRefreshing: boolean
  isLoggingOut: boolean
  loadState: () => Promise<void>
  logout: () => Promise<void>
  roleLabels: Record<Role, string>
  showLogoutModal: boolean
  customerProps: CustomerRoleProps
  merchantProps: MerchantRoleProps
  riderProps: RiderRoleProps
  adminProps: AdminRoleProps
}

export function DeliveryConsoleStage(props: DeliveryConsoleStageProps) {
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
      {role === ROLE.admin ? (
        <section className="hero-panel admin-summary-panel">
          <div className="metrics-grid">
            <MetricCard
              label={DELIVERY_CONSOLE_COPY.metrics.totalOrders}
              value={String(state?.metrics.totalOrders ?? DELIVERY_CONSOLE_COPY.metrics.missingValue)}
            />
            <MetricCard
              label={DELIVERY_CONSOLE_COPY.metrics.activeOrders}
              value={String(state?.metrics.activeOrders ?? DELIVERY_CONSOLE_COPY.metrics.missingValue)}
            />
            <MetricCard
              label={DELIVERY_CONSOLE_COPY.metrics.resolvedTickets}
              value={String(
                state?.metrics.resolvedTickets ?? DELIVERY_CONSOLE_COPY.metrics.missingValue,
              )}
            />
            <MetricCard
              label={DELIVERY_CONSOLE_COPY.metrics.averageRating}
              value={(
                state?.metrics.averageRating ?? DELIVERY_CONSOLE_COPY.metrics.defaultAverageRating
              ).toFixed(1)}
            />
          </div>
        </section>
      ) : null}

      <section className="workspace">
        <aside className="role-strip">
          <div className="session-card">
            <p className="eyebrow">{DELIVERY_CONSOLE_COPY.session.eyebrow}</p>
            <strong>{currentDisplayName}</strong>
            <span>{roleLabels[role]}</span>
          </div>
          <button
            className={`secondary-button action-feedback-button${isRefreshing ? ' is-pending' : ''}`}
            disabled={busy}
            onClick={() => void loadState()}
            type="button"
          >
            <span className={`button-indicator${isRefreshing ? ' is-spinning' : ''}`} />
            {isRefreshing
              ? DELIVERY_CONSOLE_COPY.actions.refreshPending
              : DELIVERY_CONSOLE_COPY.actions.refreshIdle}
          </button>
          <button
            className={`secondary-button action-feedback-button${isLoggingOut ? ' is-pending' : ''}`}
            disabled={busy}
            onClick={() => void logout()}
            type="button"
          >
            <span className={`button-indicator${isLoggingOut ? ' is-spinning' : ''}`} />
            {isLoggingOut
              ? DELIVERY_CONSOLE_COPY.actions.logoutPending
              : DELIVERY_CONSOLE_COPY.actions.logoutIdle}
          </button>
        </aside>

        <section className="role-stage">
          {error ? <div className="banner error">{error}</div> : null}
          {busy ? <div className="banner info">{DELIVERY_CONSOLE_COPY.banners.syncing}</div> : null}

          {role === ROLE.customer && state ? <CustomerRoleView {...props.customerProps} /> : null}
          {role === ROLE.merchant && state ? <MerchantRoleView {...props.merchantProps} /> : null}
          {role === ROLE.rider && state ? <RiderRoleView {...props.riderProps} /> : null}
          {role === ROLE.admin && state ? <AdminRoleView {...props.adminProps} /> : null}
        </section>
      </section>

      {showLogoutModal ? (
        <div className="logout-overlay" role="status" aria-live="polite">
          <div className="logout-modal">
            <div className="logout-spinner" />
            <p className="eyebrow">{DELIVERY_CONSOLE_COPY.logoutModal.eyebrow}</p>
            <h2>{DELIVERY_CONSOLE_COPY.logoutModal.title}</h2>
            <p>{DELIVERY_CONSOLE_COPY.logoutModal.description}</p>
          </div>
        </div>
      ) : null}
    </main>
  )
}
