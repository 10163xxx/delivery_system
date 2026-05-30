import type { CheckoutPanelProps } from '@/objects/customer/page/CustomerPageObjects'
import { CustomerCheckoutMenuGrid } from '@/pages/customer/checkout/CustomerCheckoutMenuGrid'
import { CustomerCheckoutSection } from '@/pages/customer/checkout/CustomerCheckoutSection'
import { CustomerCheckoutSummaryBar } from '@/pages/customer/checkout/CustomerCheckoutSummaryBar'

export function CustomerCheckoutBody(props: CheckoutPanelProps) {
  return (
    <>
      <CustomerCheckoutMenuGrid {...props} />
      <CustomerCheckoutSummaryBar {...props} />
      <CustomerCheckoutSection {...props} />
    </>
  )
}
