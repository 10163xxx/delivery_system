import { useMerchantConsoleState } from '@/pages/merchant/hooks/MerchantConsoleState'
import { MerchantApplicationPanel } from '@/pages/merchant/application/MerchantApplicationPanel'
import { MerchantConsolePanel } from '@/pages/merchant/workspace/MerchantConsolePanel'
import { MerchantOrdersWorkspacePanel } from '@/pages/merchant/workspace/MerchantOrdersWorkspacePanel'
import { MerchantProfilePanel } from '@/pages/merchant/profile/MerchantProfilePanel'
import { MerchantWorkspaceHeader } from '@/pages/merchant/workspace/MerchantWorkspaceHeader'
import { MERCHANT_WORKSPACE_VIEW } from '@/objects/page/DeliveryAppObjects'
import type { MerchantRoleProps } from '@/pages/delivery/app/roleProps'

export function MerchantRoleView(props: MerchantRoleProps) {
  const { merchantWorkspaceView } = props
  const consoleState = useMerchantConsoleState(props)

  return (
    <section className="panel-stack">
      <MerchantWorkspaceHeader {...props} />
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.application ? <MerchantApplicationPanel {...props} /> : null}
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.store ? <MerchantConsolePanel {...props} {...consoleState} /> : null}
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.orders ? <MerchantOrdersWorkspacePanel {...props} {...consoleState} /> : null}
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.profile ? <MerchantProfilePanel {...props} /> : null}
    </section>
  )
}
