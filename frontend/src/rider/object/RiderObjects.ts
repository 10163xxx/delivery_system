import type { MerchantPayoutAccount, MerchantWithdrawal } from '@/merchant/object/MerchantObjects'
import type {
  CurrencyCents,
  EntityCount,
  PersonName,
  RatingValue,
  RiderId,
  VehicleLabel,
  ZoneLabel,
} from '@/shared/object/domain/DomainObjects'

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
