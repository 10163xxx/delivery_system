import type { AddressLabel, AddressText } from '@/objects/domain/DomainObjects'

export type AddCustomerAddressRequest = {
  label: AddressLabel
  address: AddressText
}
