import type {
  MerchantApplicationId,
  ReviewMerchantApplicationRequest,
} from '@/shared/object/core/SharedObjects'
import { approveMerchantApplicationApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'
import { buildApiPath1 } from '@/shared/api/TypedApiDefinitions'

export function approveMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(approveMerchantApplicationApiDefinition, applicationId), payload)
}
