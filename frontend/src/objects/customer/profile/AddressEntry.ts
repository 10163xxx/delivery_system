import type {
  AddressLabel,
  AddressText,
  DeliveryCoordinate,
} from '@/objects/core/SharedObjects'

export type AddressEntry = {
  label: AddressLabel
  address: AddressText
  location?: DeliveryCoordinate
}
