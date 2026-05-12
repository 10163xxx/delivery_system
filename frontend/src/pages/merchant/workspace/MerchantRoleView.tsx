import { useMerchantConsoleState } from '@/merchant/app/state/MerchantConsoleState'
import { MerchantApplicationPanel } from '@/pages/merchant/application/MerchantApplicationPanel'
import { MerchantConsolePanel } from '@/pages/merchant/workspace/MerchantConsolePanel'
import { MerchantProfilePanel } from '@/pages/merchant/profile/MerchantProfilePanel'
import { MerchantWorkspaceHeader } from '@/pages/merchant/workspace/MerchantWorkspaceHeader'
import { MERCHANT_WORKSPACE_VIEW } from '@/shared/object/core/DeliveryAppObjects'
import type { MerchantRoleProps } from '@/shared/app/role-props'

export function MerchantRoleView(props: MerchantRoleProps) {
  const { merchantWorkspaceView } = props
  const consoleState = useMerchantConsoleState(props)

  return (
    <section className="panel-stack">
      <MerchantWorkspaceHeader {...props} />
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.application ? <MerchantApplicationPanel {...props} /> : null}
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.profile ? <MerchantProfilePanel {...props} /> : null}
      {merchantWorkspaceView === MERCHANT_WORKSPACE_VIEW.console ? <MerchantConsolePanel {...props} {...consoleState} /> : null}
    </section>
  )
}
