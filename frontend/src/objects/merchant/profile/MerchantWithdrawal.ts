import type {
  CurrencyCents,
  DisplayText,
  IsoDateTime,
  MerchantWithdrawalId,
} from '@/objects/domain/DomainObjects'

export type MerchantWithdrawal = {
  id: MerchantWithdrawalId
  amountCents: CurrencyCents
  accountLabel: DisplayText
  requestedAt: IsoDateTime
}
