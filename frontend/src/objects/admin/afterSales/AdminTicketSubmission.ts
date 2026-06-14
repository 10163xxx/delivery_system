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
