import {
  addCustomerAddress as addCustomerAddressRequest,
  removeCustomerAddress as removeCustomerAddressRequest,
  setDefaultCustomerAddress as setDefaultCustomerAddressRequest,
  updateCustomerProfile as updateCustomerProfileRequest,
} from '@/shared/api/SharedApi'
import {
  buildCustomerAddressPayload,
  buildCustomerProfilePayload,
  DELIVERY_CONSOLE_MESSAGES,
  validateCustomerAddressDraft,
} from '@/shared/delivery/DeliveryServices'
import type { CustomerActionParams } from '@/customer/app/actions/CustomerActionTypes'

type CustomerProfileParams = Pick<
  CustomerActionParams,
  | 'selectedCustomer'
  | 'customerNameDraft'
  | 'addressDraft'
  | 'runAction'
  | 'setError'
  | 'setAddressFormErrors'
  | 'setAddressDraft'
  | 'setSession'
>

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
      setError(DELIVERY_CONSOLE_MESSAGES.customerNameRequired)
      return
    }
    const success = await runAction(() => updateCustomerProfileRequest(selectedCustomer.id, payload))
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
      addCustomerAddressRequest(selectedCustomer.id, buildCustomerAddressPayload(addressDraft)),
    )
    if (!success) return
    setAddressDraft({ label: '', address: '' })
    setAddressFormErrors({})
  }

  async function removeCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() => removeCustomerAddressRequest(selectedCustomer.id, { address: addressId }))
  }

  async function setDefaultCustomerAddress(addressId: string) {
    if (!selectedCustomer) return
    await runAction(() => setDefaultCustomerAddressRequest(selectedCustomer.id, { address: addressId }))
  }

  return {
    saveCustomerName,
    addCustomerAddress,
    removeCustomerAddress,
    setDefaultCustomerAddress,
  }
}
