import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { MAX_RATING } from '@/features/delivery/DeliveryServices'
import { Panel } from '@/components/primitives/LayoutPrimitives'
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
