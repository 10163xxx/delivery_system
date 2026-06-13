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
