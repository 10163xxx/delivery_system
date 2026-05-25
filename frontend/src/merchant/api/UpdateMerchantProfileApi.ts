import type { UpdateMerchantProfileRequest } from '@/shared/object/core/SharedObjects'
import { updateMerchantProfileApiDefinition } from '@/shared/api/ApiRoutes'
import { postNormalizedDeliveryState } from '@/shared/api/DeliveryStateApiSupport'

export function updateMerchantProfile(payload: UpdateMerchantProfileRequest) {
  return postNormalizedDeliveryState(updateMerchantProfileApiDefinition, payload)
}
