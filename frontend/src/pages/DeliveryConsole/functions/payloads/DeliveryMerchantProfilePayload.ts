import type {
  AccountHolderName,
  AccountNumber,
  BankName,
  CurrencyCents,
  PhoneNumber,
  UpdateMerchantProfileRequest,
  WithdrawMerchantIncomeRequest,
} from '@/objects/core/SharedObjects'
import { PAYOUT_ACCOUNT_TYPE } from '@/objects/core/SharedObjects'
import {
  CURRENCY_CENTS_SCALE,
  MAX_ACCOUNT_HOLDER_LENGTH,
  MAX_ACCOUNT_NUMBER_LENGTH,
  MAX_BANK_NAME_LENGTH,
  MAX_CONTACT_PHONE_LENGTH,
} from '@/pages/DeliveryConsole/functions/shared/DeliveryConstants'
import { asDomainNumber, asDomainText, normalizeTextInput, parseCurrencyAmount } from '@/pages/DeliveryConsole/functions/shared/DeliveryShared'
import type { MerchantProfileDraft } from '@/pages/DeliveryConsole/objects/MerchantWorkspaceObjects'
import { optionalDomainText } from '@/pages/DeliveryConsole/functions/payloads/DeliveryPayloadFields'

export function buildMerchantProfilePayload(
  draft: MerchantProfileDraft,
): UpdateMerchantProfileRequest {
  return {
    contactPhone: asDomainText<PhoneNumber>(normalizeTextInput(draft.contactPhone, MAX_CONTACT_PHONE_LENGTH)),
    payoutAccount: {
      accountType: draft.payoutAccountType,
      bankName:
        draft.payoutAccountType === PAYOUT_ACCOUNT_TYPE.bank
          ? optionalDomainText<BankName>(normalizeTextInput(draft.bankName, MAX_BANK_NAME_LENGTH))
          : undefined,
      accountNumber: asDomainText<AccountNumber>(normalizeTextInput(draft.accountNumber, MAX_ACCOUNT_NUMBER_LENGTH)),
      accountHolder: asDomainText<AccountHolderName>(normalizeTextInput(draft.accountHolder, MAX_ACCOUNT_HOLDER_LENGTH)),
    },
  }
}

export function buildMerchantWithdrawPayload(
  amountYuan: number,
): WithdrawMerchantIncomeRequest {
  return { amountCents: asDomainNumber<CurrencyCents>(Math.round(amountYuan * CURRENCY_CENTS_SCALE)) }
}

export function parseMerchantWithdrawAmount(value: string) {
  return parseCurrencyAmount(value)
}
