import type { CustomerRoleProps } from '@/pages/DeliveryConsole/functions/roleProps'
import { CustomerProfilePanelContent } from '@/pages/CustomerConsole/components/profile/CustomerProfilePanelContent'

export function CustomerProfilePanels(props: CustomerRoleProps) {
  return <CustomerProfilePanelContent {...props} />
}
