// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
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
