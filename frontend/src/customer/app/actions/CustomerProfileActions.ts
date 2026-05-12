import { deliveryApi } from '@/shared/api/SharedApi'
import {
  buildCustomerAddressPayload,
  buildCustomerProfilePayload,
  DELIVERY_CONSOLE_MESSAGES,
  validateCustomerAddressDraft,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerProfileParams } from '@/customer/object/action/CustomerActionObjects'

export function createCustomerProfileActions(params: CustomerProfileParams) {
  const {
    selectedCustomer,
    customerNameDraft,
    addressDraft,
    runAction,
    setError,
    setAddressFormErrors,
    setAddressDraft,
    setSession,
  } = params

  async function saveCustomerName() {
    if (!selectedCustomer) return
    const payload = buildCustomerProfilePayload(customerNameDraft)
    if (!payload.name) {
      setError(DELIVERY_CONSOLE_MESSAGES.profile.customerNameRequired)
      return
    }
    const success = await runAction(() =>
      deliveryApi.customer.updateCustomerProfile(selectedCustomer.id, payload),
    )
    if (!success) return
    setSession((current) =>
      current
        ? {
            ...current,
            user: { ...current.user, displayName: payload.name },
          }
        : current,
    )
    setError(null)
  }

  async function addCustomerAddress() {
    if (!selectedCustomer) return
    const nextErrors = validateCustomerAddressDraft(addressDraft)
    setAddressFormErrors(nextErrors)
    if (nextErrors.label || nextErrors.address) return
    const success = await runAction(() =>
      deliveryApi.customer.addCustomerAddress(
        selectedCustomer.id,
        buildCustomerAddressPayload(addressDraft),
      ),
    )
    if (!success) return
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() =>
      deliveryApi.customer.removeCustomerAddress(selectedCustomer.id, { address: addressId }),
    )
  }

  async function setDefaultCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() =>
      deliveryApi.customer.setDefaultCustomerAddress(selectedCustomer.id, { address: addressId }),
    )
  }

  return {
    saveCustomerName,
    addCustomerAddress,
    removeCustomerAddress,
    setDefaultCustomerAddress,
  }
}
