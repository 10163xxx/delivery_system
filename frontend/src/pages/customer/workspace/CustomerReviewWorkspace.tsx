import type { CustomerRoleProps } from '@/shared/app/role-props'
import { MAX_RATING } from '@/shared/delivery/DeliveryServices'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { CustomerReviewOrderContent } from '@/pages/customer/workspace/CustomerReviewSections'
import { ORDER_PAGE_COPY } from '@/pages/order/OrderPageCopy'

export function CustomerReviewWorkspace(props: CustomerRoleProps) {
  const { REVIEW_WINDOW_DAYS } = props

  return (
    <Panel
      title={ORDER_PAGE_COPY.workspace.reviewPanelTitle}
      description={ORDER_PAGE_COPY.workspace.reviewPanelDescription(MAX_RATING, REVIEW_WINDOW_DAYS)}
    >
      <CustomerReviewOrderContent props={props} />
    </Panel>
  )
}
