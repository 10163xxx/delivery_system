import type {
  AppealStatus,
  DisplayText,
  EligibilityReviewId,
  EligibilityReviewTarget,
  EntityId,
  IsoDateTime,
  ReasonText,
  ResolutionText,
} from '@/objects/domain/DomainObjects'

export type EligibilityReview = {
  id: EligibilityReviewId
  target: EligibilityReviewTarget
  targetId: EntityId
  targetName: DisplayText
  reason: ReasonText
  status: AppealStatus
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}
