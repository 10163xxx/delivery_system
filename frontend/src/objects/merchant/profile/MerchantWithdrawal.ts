import type {
  CurrencyCents,
  DisplayText,
  IsoDateTime,
  MerchantWithdrawalId,
} from '@/objects/core/SharedObjects'

export type MerchantWithdrawal = {
  id: MerchantWithdrawalId
  amountCents: CurrencyCents
  accountLabel: DisplayText
  requestedAt: IsoDateTime
}
