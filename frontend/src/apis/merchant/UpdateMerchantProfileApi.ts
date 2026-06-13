import type { DeliveryAppState, UpdateMerchantProfileRequest } from '@/objects/core/SharedObjects'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateClient'
import { defineJsonPostApi0, routeSegment } from '@/system/api/TypedApiDefinitions'

export const updateMerchantProfileApiDefinition = defineJsonPostApi0<UpdateMerchantProfileRequest, DeliveryAppState>([
    routeSegment('api'),
    routeSegment('delivery'),
    routeSegment('merchant-profile'),
  ])

export function updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
  return postNormalizedDeliveryState(updateMerchantProfileApiDefinition, payload)
}
