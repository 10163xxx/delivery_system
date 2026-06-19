// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
