import type {
  EligibilityReviewTarget,
  EntityId,
  ReasonText,
} from '@/shared/object/domain/DomainObjects'

export type EligibilityReviewRequest = {
  target: EligibilityReviewTarget
  targetId: EntityId
  reason: ReasonText
}
