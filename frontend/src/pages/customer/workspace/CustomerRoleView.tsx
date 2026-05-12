import { CustomerOrderWorkspace } from '@/pages/customer/workspace/CustomerOrderWorkspace'
import { CustomerOrdersWorkspace } from '@/pages/customer/workspace/CustomerOrdersWorkspace'
import { CustomerProfilePanels } from '@/pages/customer/profile/CustomerProfilePanels'
import { CustomerReviewWorkspace } from '@/pages/customer/workspace/CustomerReviewWorkspace'
import { CustomerWorkspaceHeader } from '@/pages/customer/workspace/CustomerWorkspaceHeader'
import {
  CUSTOMER_WORKSPACE_VIEW,
  isCustomerProfileWorkspaceView,
} from '@/shared/object/core/DeliveryAppObjects'
import type { CustomerRoleProps } from '@/shared/app/role-props'

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
