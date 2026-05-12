import type { AddressLabel, AddressText } from '@/shared/object/domain/DomainObjects'

export type AddCustomerAddressRequest = {
  label: AddressLabel
  address: AddressText
}
