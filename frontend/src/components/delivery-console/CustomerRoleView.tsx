import { CustomerOrderWorkspace } from '@/components/delivery-console/CustomerOrderWorkspace'
import { CustomerOrdersWorkspace } from '@/components/delivery-console/CustomerOrdersWorkspace'
import { CustomerProfilePanels } from '@/components/delivery-console/CustomerProfilePanels'
import { CustomerReviewWorkspace } from '@/components/delivery-console/CustomerReviewWorkspace'
import { CustomerWorkspaceHeader } from '@/components/delivery-console/CustomerWorkspaceHeader'

export function CustomerRoleView(props: any) {
  const { customerWorkspaceView } = props

  return (
    <section className="panel-stack">
      <CustomerWorkspaceHeader customerWorkspaceView={customerWorkspaceView} navigate={props.navigate} />
      {customerWorkspaceView === 'order' ? <CustomerOrderWorkspace {...props} /> : null}
      {customerWorkspaceView === 'orders' || customerWorkspaceView === 'order-detail' ? <CustomerOrdersWorkspace {...props} /> : null}
      {customerWorkspaceView === 'review' ? <CustomerReviewWorkspace {...props} /> : null}
      {customerWorkspaceView === 'profile' || customerWorkspaceView === 'recharge' || customerWorkspaceView === 'coupons' || customerWorkspaceView === 'addresses' ? (
        <CustomerProfilePanels {...props} />
      ) : null}
    </section>
  )
}
