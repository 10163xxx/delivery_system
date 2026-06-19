// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AccountStatus,
  AddressText,
  CustomerId,
  PersonName,
  PhoneNumber,
} from '@/objects/core/SharedObjects'
import type { AddressEntry } from '@/objects/customer/profile/AddressEntry'
import type { CustomerLocation } from '@/objects/customer/profile/CustomerLocation'

export type CustomerIdentity = {
  id: CustomerId
  name: PersonName
  phone: PhoneNumber
  defaultAddress: AddressText
  location?: CustomerLocation
  addresses: AddressEntry[]
  accountStatus: AccountStatus
}
