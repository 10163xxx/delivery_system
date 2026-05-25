import type {
  ResolveReviewAppealRequest,
  ReviewAppealId,
} from '@/shared/object/core/SharedObjects'
import { resolveReviewAppealApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function resolveReviewAppeal(
  appealId: ReviewAppealId,
  payload: ResolveReviewAppealRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(resolveReviewAppealApiDefinition, appealId), payload)
}
