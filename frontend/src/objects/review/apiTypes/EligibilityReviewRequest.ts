// Business note: service protocol DTO shared with backend apiTypes; keep field names and value object types aligned.
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
