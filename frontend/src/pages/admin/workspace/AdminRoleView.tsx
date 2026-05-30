import { AdminOverviewPanel } from '@/pages/admin/workspace/AdminOverviewPanel'
import { AdminReviewPanels } from '@/pages/admin/workspace/AdminReviewPanels'
import { AdminSupportPanels } from '@/pages/admin/workspace/AdminSupportPanels'
import type { AdminRoleProps } from '@/pages/delivery/app/roleProps'

export function AdminRoleView(props: AdminRoleProps) {
  return (
    <section className="panel-stack">
      <AdminOverviewPanel {...props} />
      <AdminReviewPanels {...props} />
      <AdminSupportPanels {...props} />
    </section>
  )
}
