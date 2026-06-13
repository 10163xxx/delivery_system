import type { DeliveryAppState, ResolveReviewAppealRequest, ReviewAppealId } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const resolveReviewAppealApiDefinition = defineJsonPostApi1<ReviewAppealId, ResolveReviewAppealRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('review-appeals')],
    [routeSegment('review')],
  )

export function resolveReviewAppeal(
  appealId: ReviewAppealId,
  payload: ResolveReviewAppealRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveReviewAppealApiDefinition, appealId), payload)
}
