// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type { AddressText } from '@/objects/core/SharedObjects'

export type RemoveCustomerAddressRequest = {
  address: AddressText
}
