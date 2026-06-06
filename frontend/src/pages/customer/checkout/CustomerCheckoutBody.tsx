import type { CheckoutPanelProps } from '@/pages/customer/objects/CustomerPageObjects'
import { getCustomerAddressCoordinate } from '@/features/delivery/DeliveryServices'
import { CustomerCheckoutMenuGrid } from '@/pages/customer/checkout/CustomerCheckoutMenuGrid'
import { CustomerCheckoutSection } from '@/pages/customer/checkout/CustomerCheckoutSection'
import { CustomerCheckoutSummaryBar } from '@/pages/customer/checkout/CustomerCheckoutSummaryBar'

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
