import type {
  CurrencyCents,
  MerchantId,
  PersonName,
  PhoneNumber,
} from '@/objects/core/SharedObjects'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'
import type { MerchantWithdrawal } from '@/objects/merchant/profile/MerchantWithdrawal'

export type MerchantProfile = {
  id: MerchantId
  merchantName: PersonName
  contactPhone: PhoneNumber
  payoutAccount?: MerchantPayoutAccount
  settledIncomeCents: CurrencyCents
  withdrawnCents: CurrencyCents
  availableToWithdrawCents: CurrencyCents
  withdrawalHistory: MerchantWithdrawal[]
}
