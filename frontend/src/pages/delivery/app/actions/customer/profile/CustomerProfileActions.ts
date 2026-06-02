import {
  addCustomerAddress as addCustomerAddressApi,
  removeCustomerAddress as removeCustomerAddressApi,
  setDefaultCustomerAddress as setDefaultCustomerAddressApi,
  updateCustomerProfile as updateCustomerProfileApi,
} from '@/system/api/SharedApi'
import {
  buildCustomerAddressPayload,
  buildCustomerProfilePayload,
  DELIVERY_CONSOLE_MESSAGES,
  validateCustomerAddressDraft,
} from '@/features/delivery/DeliveryServices'
import { geocodeDeliveryAddress } from '@/features/delivery/DeliveryGeocoding'
import type { CustomerProfileParams } from '@/objects/customer/page/CustomerActionObjects'

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
    const success = await runAction(() => updateCustomerProfileApi(selectedCustomer.id, payload))
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
    const location = await geocodeDeliveryAddress(addressDraft.address)
    if (!location) {
      setAddressFormErrors({ address: DELIVERY_CONSOLE_MESSAGES.profile.addressLocationRequired })
      return
    }
    const success = await runAction(() =>
      addCustomerAddressApi(selectedCustomer.id, buildCustomerAddressPayload(addressDraft, location)),
    )
    if (!success) return
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() => removeCustomerAddressApi(selectedCustomer.id, { address: addressId }))
  }

  async function setDefaultCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() => setDefaultCustomerAddressApi(selectedCustomer.id, { address: addressId }))
  }

  return {
    saveCustomerName,
    addCustomerAddress,
    removeCustomerAddress,
    setDefaultCustomerAddress,
  }
}
