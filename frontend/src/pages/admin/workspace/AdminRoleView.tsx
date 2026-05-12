import { AdminReviewPanels } from '@/pages/admin/workspace/AdminReviewPanels'
import { AdminSupportPanels } from '@/pages/admin/workspace/AdminSupportPanels'
import { DELIVERY_CONSOLE_COPY } from '@/shared/components/primitives/DeliveryConsoleCopy'
import type { AdminRoleProps } from '@/shared/app/role-props'

function AdminIncomePanel(props: AdminRoleProps) {
  const { state, formatPrice } = props
  if (!state) return null

  return (
    <section className="ticket-card">
      <div className="ticket-header">
        <div>
          <p className="ticket-kind">{DELIVERY_CONSOLE_COPY.adminIncome.kind}</p>
          <h3>{DELIVERY_CONSOLE_COPY.adminIncome.title}</h3>
        </div>
        <span className="badge success">
          {formatPrice(state.admins[0]?.platformIncomeCents ?? 0)}
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
