import type { DeliveryAppState, MerchantApplicationId, ReviewMerchantApplicationRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { buildApiPath1, defineJsonPostApi1, routeSegment } from '@/system/api/TypedApiDefinitions'

export const rejectMerchantApplicationApiDefinition = defineJsonPostApi1<MerchantApplicationId, ReviewMerchantApplicationRequest, DeliveryAppState>(
    [routeSegment('api'), routeSegment('delivery'), routeSegment('merchant-applications')],
    [routeSegment('reject')],
  )

export function rejectMerchantApplication(
  applicationId: MerchantApplicationId,
  payload: ReviewMerchantApplicationRequest,
) {
  return postNormalizedDeliveryState(buildApiPath1(rejectMerchantApplicationApiDefinition, applicationId), payload)
}
