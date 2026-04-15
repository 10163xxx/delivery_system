import { AdminReviewPanels } from '@/admin/pages/AdminReviewPanels'
import { AdminSupportPanels } from '@/admin/pages/AdminSupportPanels'
import { DELIVERY_CONSOLE_COPY } from '@/shared/components/DeliveryConsoleCopy'
import type { AdminRoleProps } from '@/shared/AppBuildRoleProps'

function AdminIncomePanel(props: AdminRoleProps) {
  if (!props.state) return null

  return (
    <section className="ticket-card">
      <div className="ticket-header">
        <div>
          <p className="ticket-kind">{DELIVERY_CONSOLE_COPY.adminIncome.kind}</p>
          <h3>{DELIVERY_CONSOLE_COPY.adminIncome.title}</h3>
        </div>
        <span className="badge success">
          {props.formatPrice(props.state.admins[0]?.platformIncomeCents ?? 0)}
        </span>
      </div>
      <p className="meta-line">{DELIVERY_CONSOLE_COPY.adminIncome.description}</p>
    </section>
  )
}

export function AdminRoleView(props: AdminRoleProps) {
  return (
    <section className="panel-stack">
      <AdminIncomePanel {...props} />
      <AdminReviewPanels {...props} />
      <AdminSupportPanels {...props} />
    </section>
  )
}
