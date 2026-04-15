import type {
  AfterSalesRequestType,
  AfterSalesResolutionMode,
  AppealRole,
  AppealStatus,
  ApprovalFlag,
  CurrencyCents,
  CustomerId,
  DescriptionText,
  EligibilityReviewTarget,
  EligibilityReviewId,
  IsoDateTime,
  OrderId,
  PersonName,
  ReasonText,
  ResolutionText,
  ReviewAppealId,
  RatingValue,
  RiderId,
  TicketKind,
  TicketId,
  TicketStatus,
  Role,
  StoreId,
  EntityId,
} from '@/shared/object/domain/DomainObjects'
import type { Coupon } from '@/customer/object/CustomerObjects'

export type ResolutionAudit = {
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type ApprovalResolution = {
  approved: ApprovalFlag
  resolutionNote: ResolutionText
}

export type ReviewAppeal = {
  id: ReviewAppealId
  orderId: OrderId
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  riderId?: RiderId
  appellantRole: AppealRole
  reason: ReasonText
  status: AppealStatus
} & ResolutionAudit

export type EligibilityReview = {
  id: EligibilityReviewId
  target: EligibilityReviewTarget
  targetId: EntityId
  targetName: PersonName
  reason: ReasonText
  status: AppealStatus
} & ResolutionAudit

export type ReviewAppealRequest = {
  appellantRole: AppealRole
  reason: ReasonText
}

export type ResolveReviewAppealRequest = ApprovalResolution

export type EligibilityReviewRequest = {
  target: EligibilityReviewTarget
  targetId: EntityId
  reason: ReasonText
}

export type ResolveEligibilityReviewRequest = ApprovalResolution

export type ReviewSubmission = {
  rating: RatingValue
  comment?: DescriptionText
  extraNote?: ResolutionText
}

export type ReviewOrderRequest = {
  storeReview?: ReviewSubmission
  riderReview?: ReviewSubmission
}

export type AdminTicket = {
  id: TicketId
  orderId: OrderId
  kind: TicketKind
  status: TicketStatus
  summary: DescriptionText
  requestType?: AfterSalesRequestType
  submittedByRole?: Role
  submittedByName?: PersonName
  expectedCompensationCents?: CurrencyCents
  actualCompensationCents?: CurrencyCents
  approved?: ApprovalFlag
  resolutionMode?: AfterSalesResolutionMode
  issuedCoupon?: Coupon
  updatedAt: IsoDateTime
} & ResolutionAudit

export type ResolveTicketRequest = {
  resolution: ResolutionText
  note: ResolutionText
}
