import type { EligibilityReviewRequest } from '@/objects/core/SharedObjects'
import { submitEligibilityReviewApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'

export function submitEligibilityReview(payload: EligibilityReviewRequest) {
  return postNormalizedDeliveryState(submitEligibilityReviewApiDefinition, payload)
}
