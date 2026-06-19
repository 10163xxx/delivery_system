// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, EligibilityReviewId, ResolveEligibilityReviewRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const resolveEligibilityReviewApiDefinition = defineJsonPostApi1<EligibilityReviewId, ResolveEligibilityReviewRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('eligibility-reviews')],
    [routeSegment('review')],
  )

export function resolveEligibilityReview(
  reviewId: EligibilityReviewId,
  payload: ResolveEligibilityReviewRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveEligibilityReviewApiDefinition, reviewId), payload)
}
