import { AdminRoleView } from '@/pages/AdminConsole/components/workspace/AdminRoleView'
import { CustomerRoleView } from '@/pages/CustomerConsole/components/workspace/CustomerRoleView'
import { DELIVERY_CONSOLE_COPY } from '@/pages/DeliveryConsole/components/primitives/DeliveryConsoleCopy'
import { MerchantRoleView } from '@/pages/MerchantConsole/components/workspace/MerchantRoleView'
import { RiderRoleView } from '@/pages/RiderConsole/components/workspace/RiderRoleView'
import { ROLE } from '@/objects/core/SharedObjects'
import { getDeliveryAppStageFeedback } from '@/pages/DeliveryConsole/functions/DeliveryAppStageFeedback'
import type { DeliveryConsoleStageProps } from '@/objects/core/SharedViewObjects'

export function DeliveryAppStage(props: DeliveryConsoleStageProps) {
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
  const feedbackState = getDeliveryAppStageFeedback(error)

  return (
    <main className={`delivery-app delivery-app--${role}`}>
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
          {feedbackState ? <div className={`banner ${feedbackState.tone}`}>{feedbackState.text}</div> : null}
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
