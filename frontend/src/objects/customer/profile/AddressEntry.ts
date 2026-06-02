import type {
  AddressLabel,
  AddressText,
  DeliveryCoordinate,
} from '@/objects/domain/DomainObjects'

export type AddressEntry = {
  label: AddressLabel
  address: AddressText
  location?: DeliveryCoordinate
}
