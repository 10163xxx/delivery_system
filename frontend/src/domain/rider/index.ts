import type { MerchantPayoutAccount, MerchantWithdrawal } from '../merchant'
import type {
  CurrencyCents,
  EntityCount,
  PersonName,
  RatingValue,
  RiderId,
  VehicleLabel,
  ZoneLabel,
} from '../shared'

export type Rider = {
  id: RiderId
  name: PersonName
  vehicle: VehicleLabel
  zone: ZoneLabel
  availability: 'Available' | 'OnDelivery' | 'Suspended'
  averageRating: RatingValue
  ratingCount: EntityCount
  oneStarRatingCount: EntityCount
  earningsCents: CurrencyCents
  payoutAccount?: MerchantPayoutAccount
  withdrawnCents: CurrencyCents
  availableToWithdrawCents: CurrencyCents
  withdrawalHistory: MerchantWithdrawal[]
}

export type UpdateRiderProfileRequest = {
  payoutAccount: MerchantPayoutAccount
}

export type WithdrawRiderIncomeRequest = {
  amountCents: CurrencyCents
}
