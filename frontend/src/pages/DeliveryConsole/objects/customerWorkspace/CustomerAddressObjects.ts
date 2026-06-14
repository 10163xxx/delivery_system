import type {
  AddressLabel,
  AddressText,
  CustomerId,
} from '@/objects/core/SharedObjects'

export type CustomerAddressDraft = {
  label: AddressLabel
  address: AddressText
}

export const CUSTOMER_ADDRESS_FIELD = {
  label: 'label',
  address: 'address',
} as const

export type CustomerAddressField =
  (typeof CUSTOMER_ADDRESS_FIELD)[keyof typeof CUSTOMER_ADDRESS_FIELD]

export type CustomerAddressOwnerSelection = {
  customerId: CustomerId
}
