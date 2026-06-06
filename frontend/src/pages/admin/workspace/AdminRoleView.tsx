import { useState } from 'react'
import { AdminOverviewPanel } from '@/pages/admin/workspace/AdminOverviewPanel'
import { AdminReviewPanels } from '@/pages/admin/workspace/AdminReviewPanels'
import { AdminTicketPanels } from '@/pages/admin/workspace/AdminTicketPanels'
import type { AdminRoleProps } from '@/pages/delivery/app/roleProps'

const ADMIN_WORKSPACE_VIEW = {
  overview: 'overview',
  review: 'review',
  tickets: 'tickets',
} as const

type AdminWorkspaceView = (typeof ADMIN_WORKSPACE_VIEW)[keyof typeof ADMIN_WORKSPACE_VIEW]

const ADMIN_WORKSPACE_TABS: Array<{ label: string; value: AdminWorkspaceView }> = [
  { label: '运营总览', value: ADMIN_WORKSPACE_VIEW.overview },
  { label: '审核处理', value: ADMIN_WORKSPACE_VIEW.review },
  { label: '售后工单', value: ADMIN_WORKSPACE_VIEW.tickets },
]
const DEFAULT_ADMIN_WORKSPACE_TAB = ADMIN_WORKSPACE_TABS[0] as {
  label: string
  value: AdminWorkspaceView
}

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
  const [activeView, setActiveView] = useState<AdminWorkspaceView>(ADMIN_WORKSPACE_VIEW.overview)

  return (
    <section className="panel-stack">
      <AdminWorkspaceHeader activeView={activeView} onChangeView={setActiveView} />
      {activeView === ADMIN_WORKSPACE_VIEW.overview ? <AdminOverviewPanel {...props} /> : null}
      {activeView === ADMIN_WORKSPACE_VIEW.review ? <AdminReviewPanels {...props} /> : null}
      {activeView === ADMIN_WORKSPACE_VIEW.tickets ? <AdminTicketPanels {...props} /> : null}
    </section>
  )
}
