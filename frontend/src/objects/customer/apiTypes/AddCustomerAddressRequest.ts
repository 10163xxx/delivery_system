// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
import type {
  AddressLabel,
  AddressText,
  DeliveryCoordinate,
} from '@/objects/core/SharedObjects'

export type AddCustomerAddressRequest = {
  label: AddressLabel
  address: AddressText
  location: DeliveryCoordinate
}
