// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AfterSalesRequestType,
  CurrencyCents,
  IsoDateTime,
  PersonName,
  UserRole,
} from '@/objects/core/SharedObjects'

export type AdminTicketSubmission = {
  requestType?: AfterSalesRequestType
  submittedByRole?: UserRole
  submittedByName?: PersonName
  expectedCompensationCents?: CurrencyCents
  submittedAt: IsoDateTime
}
