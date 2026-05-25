import type { EligibilityReviewRequest } from '@/shared/object/core/SharedObjects'
import { submitEligibilityReviewApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function submitEligibilityReview(payload: EligibilityReviewRequest) {
  return postNormalizedDeliveryState(submitEligibilityReviewApiDefinition, payload)
}
