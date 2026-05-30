import type { Coupon } from '@/objects/customer/profile/Coupon'
import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  CurrencyCents,
  IsoDateTime,
  OrderId,
  PersonName,
  ResolutionText,
  SummaryText,
  TicketId,
  TicketKind,
  TicketStatus,
  UserRole,
} from '@/objects/domain/DomainObjects'

export type AdminTicketIdentity = {
  id: TicketId
  orderId: OrderId
  kind: TicketKind
  status: TicketStatus
  summary: SummaryText
}

export type AdminTicketSubmission = {
  requestType?: AfterSalesRequestType
  submittedByRole?: UserRole
  submittedByName?: PersonName
  expectedCompensationCents?: CurrencyCents
  submittedAt: IsoDateTime
}

export type AdminTicketResolution = {
  actualCompensationCents?: CurrencyCents
  approved?: ApprovalFlag
  resolutionMode?: AfterSalesResolutionMode
  issuedCoupon?: Coupon
  resolutionNote?: ResolutionText
  reviewedAt?: IsoDateTime
}

export type AdminTicketLifecycle = {
  updatedAt: IsoDateTime
}

export type AdminTicket = AdminTicketIdentity &
  AdminTicketLifecycle & {
    submission: AdminTicketSubmission
    resolution: AdminTicketResolution
  } & AdminTicketSubmission &
  AdminTicketResolution
