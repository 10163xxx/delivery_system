import { CustomerOrderWorkspace } from '@/customer/pages/CustomerOrderWorkspace'
import { CustomerOrdersWorkspace } from '@/customer/pages/CustomerOrdersWorkspace'
import { CustomerProfilePanels } from '@/customer/pages/CustomerProfilePanels'
import { CustomerReviewWorkspace } from '@/customer/pages/CustomerReviewWorkspace'
import { CustomerWorkspaceHeader } from '@/customer/pages/CustomerWorkspaceHeader'
import type { CustomerRoleProps } from '@/shared/AppBuildRoleProps'

export function CustomerRoleView(props: CustomerRoleProps) {
  const { customerWorkspaceView } = props

  return (
    <section className="panel-stack">
      <CustomerWorkspaceHeader customerWorkspaceView={customerWorkspaceView} navigate={props.navigate} />
      {customerWorkspaceView === 'order' ? <CustomerOrderWorkspace {...props} /> : null}
      {customerWorkspaceView === 'orders' || customerWorkspaceView === 'order-detail' ? (
        <CustomerOrdersWorkspace {...props} />
      ) : null}
      {customerWorkspaceView === 'review' ? <CustomerReviewWorkspace {...props} /> : null}
      {customerWorkspaceView === 'profile' ||
      customerWorkspaceView === 'recharge' ||
      customerWorkspaceView === 'coupons' ||
      customerWorkspaceView === 'addresses' ? (
        <CustomerProfilePanels {...props} />
      ) : null}
    </section>
  )
}
