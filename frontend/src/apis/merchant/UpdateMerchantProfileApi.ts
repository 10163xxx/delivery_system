import type { UpdateMerchantProfileRequest } from '@/objects/core/SharedObjects'
import { updateMerchantProfileApiDefinition } from '@/system/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/system/api/DeliveryStateApiSupport'

export function updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
  return postNormalizedDeliveryState(updateMerchantProfileApiDefinition, payload)
}
