import { useMerchantConsoleState } from '@/pages/MerchantConsole/hooks/MerchantConsoleState'
import { MerchantApplicationPanel } from '@/pages/MerchantConsole/components/application/MerchantApplicationPanel'
import { MerchantConsolePanel } from '@/pages/MerchantConsole/components/workspace/MerchantConsolePanel'
import { MerchantOrdersWorkspacePanel } from '@/pages/MerchantConsole/components/workspace/MerchantOrdersWorkspacePanel'
import { MerchantProfilePanel } from '@/pages/MerchantConsole/components/profile/MerchantProfilePanel'
import { MerchantWorkspaceHeader } from '@/pages/MerchantConsole/components/workspace/MerchantWorkspaceHeader'
import { MERCHANT_WORKSPACE_VIEW } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import type { MerchantRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'

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
