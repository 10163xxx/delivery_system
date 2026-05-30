import type {
  AccountHolderName,
  AccountNumber,
  BankName,
} from '@/objects/domain/DomainObjects'
import type { MerchantPayoutAccountType } from '@/objects/merchant/profile/MerchantPayoutAccountType'

export type MerchantPayoutAccount = {
  accountType: MerchantPayoutAccountType
  bankName?: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}
