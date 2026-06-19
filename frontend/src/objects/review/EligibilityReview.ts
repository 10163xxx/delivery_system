// Business note: frontend mirror of a backend service object; keep names and fields aligned unless this file is explicitly frontend-only.
import type {
  AppealStatus,
  DisplayText,
  EligibilityReviewId,
  EligibilityReviewTarget,
  EntityId,
  IsoDateTime,
  ReasonText,
  ResolutionText,
} from '@/objects/core/SharedObjects'

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
