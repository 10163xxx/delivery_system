import type {
  MerchantApplicationId,
  ReviewMerchantApplicationRequest,
} from '@/objects/core/SharedObjects'
import { approveMerchantApplicationApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/system/api/TypedApiDefinitions'

export function approveMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(approveMerchantApplicationApiDefinition, applicationId), payload)
}
