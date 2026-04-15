import { useMerchantConsoleState } from '@/merchant/app/MerchantConsoleState'
import { MerchantApplicationPanel } from '@/merchant/pages/MerchantApplicationPanel'
import { MerchantConsolePanel } from '@/merchant/pages/MerchantConsolePanel'
import { MerchantProfilePanel } from '@/merchant/pages/MerchantProfilePanel'
import { MerchantWorkspaceHeader } from '@/merchant/pages/MerchantWorkspaceHeader'
import type { MerchantRoleProps } from '@/shared/AppBuildRoleProps'

export function MerchantRoleView(props: MerchantRoleProps) {
  const { merchantWorkspaceView } = props
  const consoleState = useMerchantConsoleState(props)

  return (
    <section className="panel-stack">
      <MerchantWorkspaceHeader {...props} />
      {merchantWorkspaceView === 'application' ? <MerchantApplicationPanel {...props} /> : null}
      {merchantWorkspaceView === 'profile' ? <MerchantProfilePanel {...props} /> : null}
      {merchantWorkspaceView === 'console' ? <MerchantConsolePanel {...props} {...consoleState} /> : null}
    </section>
  )
}
