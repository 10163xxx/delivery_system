import type {
  CustomerAddressDraft,
  CustomerAddressField,
} from '@/objects/page/DeliveryAppObjects'
import { DELIVERY_CONSOLE_MESSAGES } from './DeliveryMessages'
import { MAX_ADDRESS_LABEL_LENGTH, MAX_ADDRESS_LENGTH } from './DeliveryConstants'
import { normalizeTextInput } from './DeliveryShared'

export function validateCustomerAddressDraft(
  draft: CustomerAddressDraft,
): Partial<Record<CustomerAddressField, string>> {
  const label = normalizeTextInput(draft.label, MAX_ADDRESS_LABEL_LENGTH)
  const address = normalizeTextInput(draft.address, MAX_ADDRESS_LENGTH)

  return {
    label: label
      ? undefined
      : DELIVERY_CONSOLE_MESSAGES.profile.addressLabelRequired,
    address: address
      ? undefined
      : DELIVERY_CONSOLE_MESSAGES.profile.addressContentRequired,
  }
}
