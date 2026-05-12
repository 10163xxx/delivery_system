import type {
  CurrencyCents,
  DisplayText,
  ExternalUrl,
  IsoDateTime,
} from '@/shared/object/domain/DomainObjects'

export type MerchantWithdrawal = {
  id: ExternalUrl
  amountCents: CurrencyCents
  accountLabel: DisplayText
  requestedAt: IsoDateTime
}
