import type {
  AccountHolderName,
  AccountNumber,
  BankName,
  MerchantPayoutAccountType,
  PhoneNumber,
} from '@/objects/core/SharedObjects'

export type MerchantProfileDraft = {
  contactPhone: PhoneNumber
  payoutAccountType: MerchantPayoutAccountType
  bankName: BankName
  accountNumber: AccountNumber
  accountHolder: AccountHolderName
}

export const MERCHANT_PROFILE_FORM_FIELD = {
  contactPhone: 'contactPhone',
  bankName: 'bankName',
  accountNumber: 'accountNumber',
  accountHolder: 'accountHolder',
} as const

export type MerchantProfileFormField =
  (typeof MERCHANT_PROFILE_FORM_FIELD)[keyof typeof MERCHANT_PROFILE_FORM_FIELD]
