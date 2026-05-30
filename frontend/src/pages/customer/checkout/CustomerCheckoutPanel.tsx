import type { CustomerRoleProps } from '@/pages/delivery/app/roleProps'
import { CustomerCheckoutBody } from '@/pages/customer/checkout/CustomerCheckoutBody'

export function CustomerCheckoutPanel(props: CustomerRoleProps) {
  if (!props.selectedStore) return null
  return <CustomerCheckoutBody {...props} />
}
