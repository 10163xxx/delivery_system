import type {
  CurrencyCents,
  MerchantId,
  PersonName,
  PhoneNumber,
} from '@/shared/object/domain/DomainObjects'
import type { MerchantPayoutAccount } from '@/merchant/object/profile/MerchantPayoutAccount'
import type { MerchantWithdrawal } from '@/merchant/object/profile/MerchantWithdrawal'

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
