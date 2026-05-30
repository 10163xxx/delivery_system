import type {
  MerchantApplicationId,
  ReviewMerchantApplicationRequest,
} from '@/objects/core/SharedObjects'
import { rejectMerchantApplicationApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function rejectMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rejectMerchantApplicationApiDefinition, applicationId), payload)
}
