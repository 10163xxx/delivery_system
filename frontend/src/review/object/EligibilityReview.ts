import type {
  AppealStatus,
  EligibilityReviewId,
  EligibilityReviewTarget,
  EntityId,
  IsoDateTime,
  PersonName,
  ReasonText,
  ResolutionText,
} from '@/shared/object/domain/DomainObjects'

export type EligibilityReview = {
  id: EligibilityReviewId
  target: EligibilityReviewTarget
  targetId: EntityId
  targetName: PersonName
  reason: ReasonText
  status: AppealStatus
  resolutionNote?: ResolutionText
  submittedAt: IsoDateTime
  reviewedAt?: IsoDateTime
}
