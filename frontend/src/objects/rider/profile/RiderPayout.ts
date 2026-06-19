// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type { CurrencyCents } from '@/objects/core/SharedObjects'
import type { MerchantPayoutAccount } from '@/objects/merchant/profile/MerchantPayoutAccount'
import type { MerchantWithdrawal } from '@/objects/merchant/profile/MerchantWithdrawal'

export type RiderPayout = {
  payoutAccount?: MerchantPayoutAccount
  withdrawnCents: CurrencyCents
  availableToWithdrawCents: CurrencyCents
  withdrawalHistory: MerchantWithdrawal[]
}
