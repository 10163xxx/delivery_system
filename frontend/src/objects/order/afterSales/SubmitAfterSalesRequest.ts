import type {
  AfterSalesRequestType,
  CurrencyCents,
  ReasonText,
} from '@/objects/domain/DomainObjects'

export type SubmitAfterSalesRequest = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationCents?: CurrencyCents
}
