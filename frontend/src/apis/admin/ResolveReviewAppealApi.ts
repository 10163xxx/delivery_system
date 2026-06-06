import type {
  ResolveReviewAppealRequest,
  ReviewAppealId,
} from '@/objects/core/SharedObjects'
import { resolveReviewAppealApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function resolveReviewAppeal(
  appealId: ReviewAppealId,
  payload: ResolveReviewAppealRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveReviewAppealApiDefinition, appealId), payload)
}
