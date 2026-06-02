import type {
  AddressLabel,
  AddressText,
  DeliveryCoordinate,
} from '@/objects/domain/DomainObjects'

export type AddCustomerAddressRequest = {
  label: AddressLabel
  address: AddressText
  location: DeliveryCoordinate
}
