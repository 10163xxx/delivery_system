import type { NavigateFunction } from 'react-router-dom'
import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import type { CustomerWorkspaceView } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export type CustomerRolePanelProps = {
  props: CustomerRoleProps
}

export type CustomerWorkspaceHeaderProps = {
  customerWorkspaceView: CustomerWorkspaceView
  customerProfileNoticeCount: number
  navigate: NavigateFunction
}
