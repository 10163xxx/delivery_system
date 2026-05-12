import type { CustomerRoleProps } from '@/shared/app/role-props'
import { CustomerCheckoutBody } from '@/pages/customer/checkout/CustomerCheckoutBody'

export function CustomerCheckoutPanel(props: CustomerRoleProps) {
  if (!props.selectedStore) return null
  return <CustomerCheckoutBody {...props} />
}
