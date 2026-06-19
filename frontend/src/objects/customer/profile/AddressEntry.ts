// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
