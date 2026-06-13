import type { CustomerAddressDraft, CustomerAddressField } from '@/pages/DeliveryConsole/objects/CustomerWorkspaceObjects'
import type { DisplayText } from '@/objects/core/SharedObjects'
import { DELIVERY_CONSOLE_MESSAGES } from '@/pages/DeliveryConsole/functions/shared/DeliveryMessages'
import { MAX_ADDRESS_LABEL_LENGTH, MAX_ADDRESS_LENGTH } from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainText, normalizeTextInput } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'

export function validateCustomerAddressDraft(
  draft: CustomerAddressDraft,
): Partial<Record<CustomerAddressField, DisplayText>> {
  const label = normalizeTextInput(draft.label, MAX_ADDRESS_LABEL_LENGTH)
  const address = normalizeTextInput(draft.address, MAX_ADDRESS_LENGTH)

  return {
    label: label
      ? undefined
      : asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.profile.addressLabelRequired),
    address: address
      ? undefined
      : asDomainText<DisplayText>(DELIVERY_CONSOLE_MESSAGES.profile.addressContentRequired),
  }
}
