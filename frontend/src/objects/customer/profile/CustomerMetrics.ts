import type {
  CurrencyCents,
  EntityCount,
  MembershipTier,
} from '@/objects/core/SharedObjects'
import type { Coupon } from '@/objects/customer/profile/Coupon'

export type CustomerMetrics = {
  revokedReviewCount: EntityCount
  membershipTier: MembershipTier
  monthlySpendCents: CurrencyCents
  balanceCents: CurrencyCents
  coupons: Coupon[]
}
