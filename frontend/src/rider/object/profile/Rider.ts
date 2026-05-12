import type {
  CurrencyCents,
  EntityCount,
  PersonName,
  RatingValue,
  RiderId,
  VehicleLabel,
  ZoneLabel,
} from '@/shared/object/domain/DomainObjects'
import type { AvailabilityLabel } from '@/shared/object/domain/DomainTypes'
import type { MerchantPayoutAccount } from '@/merchant/object/profile/MerchantPayoutAccount'
import type { MerchantWithdrawal } from '@/merchant/object/profile/MerchantWithdrawal'

export type RiderIdentity = {
  id: RiderId
  name: PersonName
  vehicle: VehicleLabel
  zone: ZoneLabel
  availability: AvailabilityLabel
}

export type RiderPerformance = {
  averageRating: RatingValue
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  earningsCents: CurrencyCents
}

export type RiderPayout = {
  payoutAccount?: MerchantPayoutAccount
  withdrawnCents: CurrencyCents
  availableToWithdrawCents: CurrencyCents
  withdrawalHistory: MerchantWithdrawal[]
}

export type Rider = RiderIdentity & {
  performance: RiderPerformance
  payout: RiderPayout
} & RiderPerformance & RiderPayout
