import type {
  CurrencyCents,
  DisplayText,
  IsoDateTime,
  MerchantWithdrawalId,
} from '@/shared/object/domain/DomainObjects'

export type MerchantWithdrawal = {
  id: MerchantWithdrawalId
  amountCents: CurrencyCents
  accountLabel: DisplayText
  requestedAt: IsoDateTime
}
