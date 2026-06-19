// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
