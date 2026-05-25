import type {
  MerchantApplicationId,
  ReviewMerchantApplicationRequest,
} from '@/shared/object/core/SharedObjects'
import { rejectMerchantApplicationApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function rejectMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rejectMerchantApplicationApiDefinition, applicationId), payload)
}
