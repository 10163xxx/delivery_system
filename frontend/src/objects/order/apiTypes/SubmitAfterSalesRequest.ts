// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
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
