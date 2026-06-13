import type { CheckoutPanelProps } from '@/pages/CustomerConsole/objects/CustomerCheckoutObjects'
import { getCustomerAddressCoordinate } from '@/pages/DeliveryConsole/functions/map/DeliveryDistance'
import { CustomerCheckoutMenuGrid } from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutMenuGrid'
import { CustomerCheckoutSection } from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutSection'
import { CustomerCheckoutSummaryBar } from '@/pages/CustomerConsole/components/checkout/CustomerCheckoutSummaryBar'

export function CustomerCheckoutBody(props: CheckoutPanelProps) {
  const checkoutAddress = props.deliveryAddress.trim() || props.selectedCustomer?.defaultAddress || ''
  const addressCoordinate = getCustomerAddressCoordinate(props.selectedCustomer, checkoutAddress)
  const nextProps = {
    ...props,
    deliveryAddressIsLocated: Boolean(addressCoordinate),
    deliveryAddressIsLocating: false,
  }

  return (
    <>
      <CustomerCheckoutMenuGrid {...nextProps} />
      <CustomerCheckoutSummaryBar {...nextProps} />
      <CustomerCheckoutSection {...nextProps} />
    </>
  )
}
