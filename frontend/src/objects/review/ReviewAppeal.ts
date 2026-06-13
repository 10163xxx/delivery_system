import type {
  AppealRole,
  AppealStatus,
  CustomerId,
  IsoDateTime,
  OrderId,
  PersonName,
  ReasonText,
  ResolutionText,
  ReviewAppealId,
  RiderId,
  StoreId,
} from '@/objects/core/SharedObjects'

export type ReviewAppealIdentity = {
  id: ReviewAppealId
  orderId: OrderId
  customerId: CustomerId
  customerName: PersonName
  storeId: StoreId
  riderId?: RiderId
}

export type ReviewAppealDecision = {
  appellantRole: AppealRole
  reason: ReasonText
}

export type ReviewAppealReview = {
  status: AppealStatus
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}

export type ReviewAppeal = ReviewAppealIdentity & ReviewAppealDecision & {
  review: ReviewAppealReview
} & ReviewAppealReview
