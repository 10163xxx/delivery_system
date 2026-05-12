import type { CustomerRoleProps } from '@/shared/app/role-props'
import { MAX_RATING } from '@/shared/delivery/DeliveryServices'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import { CustomerReviewOrderContent } from '@/pages/customer/workspace/CustomerReviewSections'

export function CustomerReviewWorkspace(props: CustomerRoleProps) {
  const { REVIEW_WINDOW_DAYS } = props

  return (
    <Panel
      title="订单评价"
      description={`商家与骑手评价现在分开提交。${MAX_RATING} 星可直接提交，非 ${MAX_RATING} 星必须填写理由；评价入口仅保留到订单完成后 ${REVIEW_WINDOW_DAYS} 天内。`}
    >
      <CustomerReviewOrderContent props={props} />
    </Panel>
  )
}
