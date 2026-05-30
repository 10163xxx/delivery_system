import type {
  EligibilityReviewId,
  ResolveEligibilityReviewRequest,
} from '@/objects/core/SharedObjects'
import { resolveEligibilityReviewApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function resolveEligibilityReview(
  reviewId: EligibilityReviewId,
  payload: ResolveEligibilityReviewRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveEligibilityReviewApiDefinition, reviewId), payload)
}
