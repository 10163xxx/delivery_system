import { AdminReviewPanels } from '@/components/delivery-console/AdminReviewPanels'
import { AdminSupportPanels } from '@/components/delivery-console/AdminSupportPanels'

export function AdminRoleView(props: any) {
  return (
    <section className="panel-stack">
      <AdminReviewPanels {...props} />
      <AdminSupportPanels {...props} />
    </section>
  )
}
