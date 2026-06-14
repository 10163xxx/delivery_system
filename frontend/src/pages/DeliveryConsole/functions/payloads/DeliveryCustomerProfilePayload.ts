import type {
  AddCustomerAddressRequest,
  AddressLabel,
  AddressText,
  DeliveryCoordinate,
  PersonName,
  UpdateCustomerProfileRequest,
} from '@/objects/core/SharedObjects'
import {
  MAX_ADDRESS_LABEL_LENGTH,
  MAX_ADDRESS_LENGTH,
  MAX_CUSTOMER_NAME_LENGTH,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainText, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { CustomerAddressDraft } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'

export function buildCustomerProfilePayload(name: string): UpdateCustomerProfileRequest {
  return { name: asDomainText<PersonName>(normalizeTextInput(name, MAX_CUSTOMER_NAME_LENGTH)) }
}

export function buildCustomerAddressPayload(
  draft: CustomerAddressDraft,
  location: DeliveryCoordinate,
): AddCustomerAddressRequest {
  return {
    label: asDomainText<AddressLabel>(normalizeTextInput(draft.label, MAX_ADDRESS_LABEL_LENGTH)),
    address: asDomainText<AddressText>(normalizeTextInput(draft.address, MAX_ADDRESS_LENGTH)),
    location,
  }
}
