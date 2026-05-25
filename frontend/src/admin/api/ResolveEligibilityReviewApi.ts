import type {
  EligibilityReviewId,
  ResolveEligibilityReviewRequest,
} from '@/shared/object/core/SharedObjects'
import { resolveEligibilityReviewApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function resolveEligibilityReview(
  reviewId: EligibilityReviewId,
  payload: ResolveEligibilityReviewRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveEligibilityReviewApiDefinition, reviewId), payload)
}
