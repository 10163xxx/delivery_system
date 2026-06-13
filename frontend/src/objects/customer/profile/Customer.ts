import type {
  AccountStatus,
  AddressText,
  CurrencyCents,
  DeliveryCoordinate,
  CustomerId,
  EntityCount,
  MembershipTier,
  PersonName,
  PhoneNumber,
} from '@/objects/core/SharedObjects'
import type { AddressEntry } from '@/objects/customer/profile/AddressEntry'
import type { Coupon } from '@/objects/customer/profile/Coupon'

export type CustomerIdentity = {
  id: CustomerId
  name: PersonName
  phone: PhoneNumber
  defaultAddress: AddressText
  location?: CustomerLocation
  addresses: AddressEntry[]
}

export type CustomerLocation = DeliveryCoordinate

export type CustomerMetrics = {
  revokedReviewCount: EntityCount
  membershipTier: MembershipTier
  monthlySpendCents: CurrencyCents
  balanceCents: CurrencyCents
  coupons: Coupon[]
}

export type Customer = CustomerIdentity & {
  accountStatus: AccountStatus
  metrics: CustomerMetrics
} & CustomerMetrics
