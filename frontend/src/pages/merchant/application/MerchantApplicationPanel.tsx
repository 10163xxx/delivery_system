import type { MerchantRoleProps } from '@/shared/app/role-props'
import { MERCHANT_APPLICATION_VIEW } from '@/shared/object/core/DeliveryAppObjects'
import { Panel } from '@/shared/components/primitives/LayoutPrimitives'
import {
  MerchantApplicationForm,
  MerchantApplicationTabs,
  MerchantPendingApplicationsPanel,
  MerchantReviewedApplicationsPanel,
} from '@/pages/merchant/application/MerchantApplicationSections'

export function MerchantApplicationPanel(props: MerchantRoleProps) {
  return (
    <Panel title="商家入驻申请" description="商家提交店铺资料后，需要管理员审核通过才能正式入驻。">
      <MerchantApplicationTabs {...props} />
      {props.merchantApplicationView === MERCHANT_APPLICATION_VIEW.pending ? <MerchantPendingApplicationsPanel {...props} /> : null}
      {props.merchantApplicationView === MERCHANT_APPLICATION_VIEW.reviewed ? <MerchantReviewedApplicationsPanel {...props} /> : null}
      {props.merchantApplicationView === MERCHANT_APPLICATION_VIEW.submit ? <MerchantApplicationForm {...props} /> : null}
    </Panel>
  )
}
