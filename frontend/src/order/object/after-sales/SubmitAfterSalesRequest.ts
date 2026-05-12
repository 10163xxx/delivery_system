import type {
  AfterSalesRequestType,
  CurrencyCents,
  ReasonText,
} from '@/shared/object/domain/DomainObjects'

export type SubmitAfterSalesRequest = {
  requestType: AfterSalesRequestType
  reason: ReasonText
  expectedCompensationCents?: CurrencyCents
}
