import type {
  CurrencyCents,
  EntityCount,
  PersonName,
  RatingValue,
  RiderId,
  VehicleLabel,
  ZoneLabel,
} from '@/objects/domain/DomainObjects'
import type { AvailabilityLabel } from '@/objects/domain/DomainTypes'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'
import type { MerchantWithdrawal } from '@/objects/merchant/profile/MerchantWithdrawal'

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
