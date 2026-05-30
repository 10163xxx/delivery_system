import type {
  EligibilityReviewTarget,
  EntityId,
  ReasonText,
} from '@/objects/domain/DomainObjects'

export type EligibilityReviewRequest = {
  target: EligibilityReviewTarget
  targetId: EntityId
  reason: ReasonText
}
