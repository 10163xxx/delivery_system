import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { MAX_RATING } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { Panel } from '@/pages/DeliveryConsole/components/primitives/LayoutPrimitives'
import { CustomerReviewOrderContent } from '@/pages/CustomerConsole/components/workspace/CustomerReviewSections'
import { ORDER_PAGE_COPY } from '@/pages/OrderConsole/OrderPageCopy'

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
