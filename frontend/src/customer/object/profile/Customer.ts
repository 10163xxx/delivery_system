import type {
  AccountStatus,
  AddressText,
  CurrencyCents,
  CustomerId,
  EntityCount,
  MembershipTier,
  PersonName,
  PhoneNumber,
} from '@/shared/object/domain/DomainObjects'
import type { AddressEntry } from '@/customer/object/profile/AddressEntry'
import type { Coupon } from '@/customer/object/profile/Coupon'

export type CustomerIdentity = {
  id: CustomerId
  name: PersonName
  phone: PhoneNumber
  defaultAddress: AddressText
  addresses: AddressEntry[]
}

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
