import { MerchantApplicationPanel } from '@/components/delivery-console/MerchantApplicationPanel'
import { MerchantConsolePanel } from '@/components/delivery-console/MerchantConsolePanel'
import { MerchantProfilePanel } from '@/components/delivery-console/MerchantProfilePanel'
import { MerchantWorkspaceHeader } from '@/components/delivery-console/MerchantWorkspaceHeader'
import { useMerchantConsoleState } from '@/components/delivery-console/useMerchantConsoleState'

export function MerchantRoleView(props: any) {
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
