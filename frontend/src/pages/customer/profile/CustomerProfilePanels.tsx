import type { CustomerRoleProps } from '@/shared/app/role-props'
import { CustomerProfilePanelContent } from '@/pages/customer/profile/CustomerProfilePanelContent'

export function CustomerProfilePanels(props: CustomerRoleProps) {
  return <CustomerProfilePanelContent {...props} />
}
