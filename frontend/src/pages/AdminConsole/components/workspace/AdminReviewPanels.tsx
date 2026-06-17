import type { AdminRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { AppealReviewPanel } from '@/pages/AdminConsole/components/workspace/AppealReviewPanel'
import { EligibilityReviewPanel } from '@/pages/AdminConsole/components/workspace/EligibilityReviewPanel'
import { MerchantApplicationReviewPanel } from '@/pages/AdminConsole/components/workspace/MerchantApplicationReviewPanel'

export function AdminReviewPanels(props: AdminRoleProps) {
  return (
    <>
      <MerchantApplicationReviewPanel props={props} />
      <AppealReviewPanel props={props} />
      <EligibilityReviewPanel props={props} />
    </>
  )
}
