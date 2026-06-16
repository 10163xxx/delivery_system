import {
  addCustomerAddress as addCustomerAddressApi,
  removeCustomerAddress as removeCustomerAddressApi,
  setDefaultCustomerAddress as setDefaultCustomerAddressApi,
  updateCustomerProfile as updateCustomerProfileApi,
} from '@/system/api/SharedApi'
import { buildCustomerAddressPayload, buildCustomerProfilePayload } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadCustomer'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { validateCustomerAddressDraft } from '@/pages/DeliveryConsole/functions/validation/DeliveryValidationCustomer'
import { geocodeDeliveryAddress } from '@/pages/DeliveryConsole/functions/map/DeliveryGeocoding'
import type { AddressLabel, AddressText, DisplayText } from '@/objects/core/SharedObjects'
import type { CustomerProfileParams } from '@/pages/CustomerConsole/objects/CustomerActionObjects'
import { asDomainText } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

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
      setError(asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.profile.customerNameRequired))
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
      setAddressFormErrors({
        address: asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.profile.addressLocationRequired),
      })
      return
    }
    const success = await runAction(() =>
      addCustomerAddressApi(selectedCustomer.id, buildCustomerAddressPayload(addressDraft, location)),
    )
    if (!success) return
    setAddressDraft({
      label: asDomainText<AddressLabel>(''),
      address: asDomainText<AddressText>(''),
    })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(addressId: AddressText) {
    if (!selectedCustomer) return
    await runAction(() => removeCustomerAddressApi(selectedCustomer.id, { address: addressId }))
  }

  async function setDefaultCustomerAddress(addressId: AddressText) {
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
