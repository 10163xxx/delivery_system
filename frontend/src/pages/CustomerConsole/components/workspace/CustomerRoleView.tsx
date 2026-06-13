import { CustomerCartWorkspace } from '@/pages/CustomerConsole/components/checkout/CustomerCartWorkspace'
import { CustomerOrderWorkspace } from '@/pages/CustomerConsole/components/workspace/CustomerOrderWorkspace'
import { CustomerOrdersWorkspace } from '@/pages/CustomerConsole/components/workspace/CustomerOrdersWorkspace'
import { CustomerProfilePanels } from '@/pages/CustomerConsole/components/profile/CustomerProfilePanels'
import { CustomerReviewWorkspace } from '@/pages/CustomerConsole/components/workspace/CustomerReviewWorkspace'
import { CustomerWorkspaceHeader } from '@/pages/CustomerConsole/components/workspace/CustomerWorkspaceHeader'
import { CUSTOMER_WORKSPACE_VIEW, isCustomerProfileWorkspaceView } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'

export function CustomerRoleView(props: CustomerRoleProps) {
  const { customerWorkspaceView } = props

  return (
    <section className="panel-stack">
      <CustomerWorkspaceHeader
        customerWorkspaceView={customerWorkspaceView}
        customerProfileNoticeCount={props.customerProfileNoticeCount}
        navigate={props.navigate}
      />
      {customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.order ? <CustomerOrderWorkspace {...props} /> : null}
      {customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.cart ? <CustomerCartWorkspace {...props} /> : null}
      {customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.orders ||
      customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.orderDetail ? (
        <CustomerOrdersWorkspace {...props} />
      ) : null}
      {customerWorkspaceView === CUSTOMER_WORKSPACE_VIEW.review ? <CustomerReviewWorkspace {...props} /> : null}
      {isCustomerProfileWorkspaceView(customerWorkspaceView) ? (
        <CustomerProfilePanels {...props} />
      ) : null}
    </section>
  )
}
