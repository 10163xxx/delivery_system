import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { CustomerProfilePanelContent } from '@/pages/customer/profile/CustomerProfilePanelContent'

export function CustomerProfilePanels(props: CustomerRoleProps) {
  return <CustomerProfilePanelContent {...props} />
}
