// Business note: frontend API client for the matching backend APIMessage; keep operation names and payload DTOs aligned.
import type { DeliveryAppState, MerchantRegistrationRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const submitMerchantApplicationApiDefinition = defineJsonPostApi0<MerchantRegistrationRequest, DeliveryAppState>([
    routeSegment('api'),
    routeSegment('delivery'),
    routeSegment('merchant-applications'),
  ])

export function submitMerchantApplication(payload: MerchantRegistrationRequest) {
  return postNormalizedDeliveryState(submitMerchantApplicationApiDefinition, payload)
}
