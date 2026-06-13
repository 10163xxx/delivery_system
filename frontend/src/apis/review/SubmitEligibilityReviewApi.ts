import type { DeliveryAppState, EligibilityReviewRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const submitEligibilityReviewApiDefinition = defineJsonPostApi0<EligibilityReviewRequest, DeliveryAppState>([
    routeSegment('api'),
    routeSegment('delivery'),
    routeSegment('eligibility-reviews'),
  ])

export function submitEligibilityReview(payload: EligibilityReviewRequest) {
  return postNormalizedDeliveryState(submitEligibilityReviewApiDefinition, payload)
}
