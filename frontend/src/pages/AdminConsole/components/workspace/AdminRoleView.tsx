import { AdminOverviewPanel } from '@/pages/AdminConsole/components/workspace/AdminOverviewPanel'
import { AdminReviewPanels } from '@/pages/AdminConsole/components/workspace/AdminReviewPanels'
import { AdminTicketPanels } from '@/pages/AdminConsole/components/workspace/AdminTicketPanels'
import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import {
  ADMIN_WORKSPACE_TABS,
  ADMIN_WORKSPACE_VIEW,
  DEFAULT_ADMIN_WORKSPACE_TAB,
  type AdminWorkspaceView,
  useAdminWorkspaceState,
} from '@/pages/AdminConsole/hooks/AdminWorkspaceState'

function AdminWorkspaceHeader({
  activeView,
  onChangeView,
}: {
  activeView: AdminWorkspaceView
  onChangeView: (view: AdminWorkspaceView) => void
}) {
  const activeTab = ADMIN_WORKSPACE_TABS.find((tab) => tab.value === activeView) ?? DEFAULT_ADMIN_WORKSPACE_TAB

  return (
    <div className="summary-bar admin-workspace-nav">
      <div>
        <p>管理员工作台</p>
        <strong>{activeTab.label}</strong>
      </div>
      <div className="action-row">
        {ADMIN_WORKSPACE_TABS.map((tab) => (
          <button
            key={tab.value}
            className={activeView === tab.value ? 'primary-button' : 'secondary-button'}
            onClick={() => onChangeView(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AdminRoleView(props: AdminRoleProps) {
  const { activeView, setActiveView } = useAdminWorkspaceState()

  return (
    <section className="panel-stack">
      <AdminWorkspaceHeader activeView={activeView} onChangeView={setActiveView} />
      {activeView === ADMIN_WORKSPACE_VIEW.overview ? <AdminOverviewPanel {...props} /> : null}
      {activeView === ADMIN_WORKSPACE_VIEW.review ? <AdminReviewPanels {...props} /> : null}
      {activeView === ADMIN_WORKSPACE_VIEW.tickets ? <AdminTicketPanels {...props} /> : null}
    </section>
  )
}
