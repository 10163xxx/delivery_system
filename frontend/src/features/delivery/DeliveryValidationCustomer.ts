import type {
  CustomerAddressDraft,
  CustomerAddressField,
} from '@/objects/page/DeliveryAppObjects'
import { DELIVERY_CONSOLE_MESSAGES } from './DeliveryMessages'
import { buildCustomerAddressPayload } from './DeliveryPayloads'

export function validateCustomerAddressDraft(
  draft: CustomerAddressDraft,
): Partial<Record<CustomerAddressField, string>> {
  const payload = buildCustomerAddressPayload(draft)

  return {
    label: payload.label
      ? undefined
      : DELIVERY_CONSOLE_MESSAGES.profile.addressLabelRequired,
    address: payload.address
      ? undefined
      : DELIVERY_CONSOLE_MESSAGES.profile.addressContentRequired,
  }
}
