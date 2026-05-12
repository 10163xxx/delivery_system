import type { Coupon } from '@/customer/object/profile/Coupon'
import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  ApprovalFlag,
  CurrencyCents,
  DescriptionText,
  IsoDateTime,
  OrderId,
  PersonName,
  ResolutionText,
  Role,
  TicketId,
  TicketKind,
  TicketStatus,
} from '@/shared/object/domain/DomainObjects'

export type AdminTicketIdentity = {
  id: TicketId
  orderId: OrderId
  kind: TicketKind
  status: TicketStatus
  summary: DescriptionText
}

export type AdminTicketSubmission = {
  requestType?: AfterSalesRequestType
  submittedByRole?: Role
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
