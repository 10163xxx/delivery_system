import type {
  AccountStatus,
  AddressLabel,
  AddressText,
  CouponId,
  CurrencyCents,
  CustomerId,
  DescriptionText,
  EntityCount,
  IsoDateTime,
  MembershipTier,
  PersonName,
  PhoneNumber,
} from '@/shared/object/domain'

export type AddressEntry = {
  label: AddressLabel
  address: AddressText
}

export type Coupon = {
  id: CouponId
  title: DescriptionText
  discountCents: CurrencyCents
  minimumSpendCents: CurrencyCents
  description: DescriptionText
  expiresAt: IsoDateTime
}

export type Customer = {
  id: CustomerId
  name: PersonName
  phone: PhoneNumber
  defaultAddress: AddressText
  addresses: AddressEntry[]
  accountStatus: AccountStatus
  revokedReviewCount: EntityCount
  membershipTier: MembershipTier
  monthlySpendCents: CurrencyCents
  balanceCents: CurrencyCents
  coupons: Coupon[]
}

export type UpdateCustomerProfileRequest = {
  name: PersonName
}

export type AddCustomerAddressRequest = {
  label: AddressLabel
  address: AddressText
}

export type RemoveCustomerAddressRequest = {
  address: AddressText
}

export type SetDefaultCustomerAddressRequest = {
  address: AddressText
}

export type RechargeBalanceRequest = {
  amountCents: CurrencyCents
}
