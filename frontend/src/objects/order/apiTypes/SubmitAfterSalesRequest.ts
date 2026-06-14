import type {
  AfterSalesRequestType,
  CurrencyCents,
  ReasonText,
} from '@/objects/core/SharedObjects'

export type SubmitAfterSalesRequest = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationCents?: CurrencyCents
}
