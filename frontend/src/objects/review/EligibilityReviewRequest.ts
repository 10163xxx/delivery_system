import type {
  EligibilityReviewTarget,
  EntityId,
  ReasonText,
} from '@/objects/core/SharedObjects'

export type EligibilityReviewRequest = {
  target: EligibilityReviewTarget
  targetId: EntityId
  reason: ReasonText
}
