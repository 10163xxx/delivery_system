import type {
  AccountHolderName,
  AccountNumber,
  BankName,
} from '@/shared/object/domain/DomainObjects'
import type { MerchantPayoutAccountType } from '@/merchant/object/profile/MerchantPayoutAccountType'

export type MerchantPayoutAccount = {
  accountType: MerchantPayoutAccountType
  bankName?: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}
